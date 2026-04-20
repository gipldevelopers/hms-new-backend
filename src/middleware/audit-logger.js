const { logActivity } = require("../utils/logger");

/**
 * Middleware to automatically log mutation requests (POST, PUT, DELETE)
 * @param {string} moduleName - The name of the module being accessed
 */
const auditLogger = (moduleName) => {
  return async (req, res, next) => {
    // Only log mutations (POST, PUT, DELETE, PATCH)
    if (["GET", "OPTIONS", "HEAD"].includes(req.method)) {
      return next();
    }

    const start = Date.now();
    
    // Capture request data early
    const reqData = {
      method: req.method,
      url: req.originalUrl,
      body: req.body ? { ...req.body } : {},
      params: req.params,
      query: req.query,
      user: req.user ? { ...req.user } : null,
      ip: req.ip || req.get('x-forwarded-for') || req.connection.remoteAddress,
      ua: req.get("User-Agent")
    };

    // Sensitive data masking
    if (reqData.body.password) reqData.body.password = "********";
    if (reqData.body.dbPassword) reqData.body.dbPassword = "********";

    // Listen for response finish
    res.on("finish", () => {
      try {
        const statusCode = res.statusCode;
        
        // Determine action name
        let action = `${reqData.method}_${reqData.url.split("/")[2]?.split("?")[0]?.toUpperCase() || "UNKNOWN"}`;
        
        const path = reqData.url.toLowerCase();
        if (path.includes("/auth/login")) action = "USER_LOGIN";
        if (path.includes("/auth/logout")) action = "USER_LOGOUT";
        if (path.includes("/users") && reqData.method === "POST") action = "PROVISION_USER";
        if (path.includes("/branches") && reqData.method === "POST") action = "CREATE_BRANCH";
        
        // Prepare details
        const details = {
          method: reqData.method,
          url: reqData.url,
          params: reqData.params,
          query: reqData.query,
          body: reqData.body,
          responseStatus: statusCode,
          duration: Date.now() - start
        };

        // Async log without blocking
        logActivity({
          userId: reqData.user?.id || null,
          userEmail: reqData.user?.email || "system",
          userName: reqData.user?.name || "System",
          userRole: reqData.user?.role || "SYSTEM",
          action: action,
          module: moduleName || "GENERAL",
          status: statusCode < 400 ? "SUCCESS" : "FAILED",
          details: details,
          ipAddress: reqData.ip,
          userAgent: reqData.ua,
        }).catch((err) => console.error("Audit log failed:", err));
      } catch (err) {
        console.error("Audit logger after-response error:", err);
      }
    });

    next();
  };
};

module.exports = auditLogger;
