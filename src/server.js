require("dotenv").config();

// Schema generation must happen before loading app modules
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync, exec } = require("child_process");

const schemaPath = path.resolve(__dirname, "../prisma/tenant.schema");
const versionFilePath = path.resolve(__dirname, "./generated/tenant-client/schema-version.txt");

const getTenantSchemaHash = () => {
  if (!fs.existsSync(schemaPath)) return "unknown";
  const content = fs.readFileSync(schemaPath, "utf8");
  return crypto.createHash("sha256").update(content).digest("hex").substring(0, 12);
};

const runPrismaGenerateIfNeeded = () => {
  const logFile = path.resolve(__dirname, "../check-generate.txt");
  try {
    const currentHash = getTenantSchemaHash();
    let savedHash = "";
    if (fs.existsSync(versionFilePath)) {
      savedHash = fs.readFileSync(versionFilePath, "utf8").trim();
    }

    fs.writeFileSync(logFile, `Current Hash: ${currentHash}\nSaved Hash: ${savedHash}\n`, "utf8");

    if (currentHash !== savedHash) {
      console.log(`\n🔄 Tenant schema changed (${savedHash || "none"} -> ${currentHash}). Generating Prisma client...`);
      const genDir = path.dirname(versionFilePath);
      if (!fs.existsSync(genDir)) {
        fs.mkdirSync(genDir, { recursive: true });
      }
      
      fs.appendFileSync(logFile, "Running npx --no-install prisma generate...\n", "utf8");
      
      try {
        const stdout = execSync(`npx --no-install prisma generate --schema="${schemaPath}"`, { encoding: "utf8" });
        fs.appendFileSync(logFile, "GENERATION SUCCESS:\n" + stdout + "\n", "utf8");
        fs.writeFileSync(versionFilePath, currentHash, "utf8");
        console.log("✅ Tenant Prisma client generated successfully.\n");
      } catch (err) {
        console.error("❌ Failed to generate tenant client:", err.message);
        fs.appendFileSync(logFile, `GENERATION ERROR:\n${err.message}\n${err.stderr || ""}\n${err.stdout || ""}\n`, "utf8");
      }
    } else {
      console.log("✅ Tenant Prisma client is up to date.");
      fs.appendFileSync(logFile, "Prisma client is up to date.\n", "utf8");
    }
  } catch (err) {
    console.error("❌ Failed to verify/generate tenant client:", err.message);
    fs.appendFileSync(logFile, `GENERATION ERROR:\n${err.message}\n`, "utf8");
  }
};

runPrismaGenerateIfNeeded();

const app = require("./app");
const http = require("http");

const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;

const server = http.createServer(app);

// Start Server
server.listen(PORT, async () => {
  console.log("\n========================================");
  console.log("GVoice HMS Backend Online");
  console.log("Server running on:", SERVER_URL);
  console.log("Client URL allowed:", CLIENT_URL);
  console.log("Health check:", `${SERVER_URL}/health`);
  console.log("Started at:", new Date().toLocaleString());
  console.log("========================================\n");

  try {
    console.log("🔄 Syncing tenant databases on startup...");
    const { syncAllTenants } = require("./database/tenant-manager");
    await syncAllTenants(true);
    console.log("✅ Tenant database sync completed.");
  } catch (err) {
    console.error("❌ Failed to sync tenant databases on startup:", err.message);
  }
});

// Graceful Shutdown
const shutdown = () => {
  console.log("\n⚠️  Shutting down server...");

  server.close(() => {
    console.log("✅ Server closed safely.");
    process.exit(0);
  });

  setTimeout(() => {
    console.log("⏳ Forced shutdown due to timeout.");
    process.exit(1);
  }, 5000);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

module.exports = server;