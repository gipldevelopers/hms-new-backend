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

    // Standard res.json override to capture response body for login
    const originalJson = res.json;
    res.json = function (data) {
      res.locals.body = data;
      return originalJson.apply(res, arguments);
    };

    // Listen for response finish
    res.on("finish", () => {
      try {
        const statusCode = res.statusCode;
        const responseData = res.locals.body;
        
        // Determine action name
        let action = `${reqData.method}_${reqData.url.split("/")[2]?.split("?")[0]?.toUpperCase() || "UNKNOWN"}`;
        
        const path = reqData.url.toLowerCase();
        if (path.includes("/auth/login")) action = "USER_LOGIN";
        if (path.includes("/auth/logout")) action = "USER_LOGOUT";
        if (path.includes("/users") && reqData.method === "POST") action = "PROVISION_USER";
        if (path.includes("/branches") && reqData.method === "POST") action = "CREATE_BRANCH";
        
        // Extract user info for login if not present
        let logUser = reqData.user;
        if (action === "USER_LOGIN" && !logUser) {
          if (responseData?.success && responseData.data?.user) {
            logUser = responseData.data.user;
          } else {
            // Failed login - use request email
            logUser = {
              email: reqData.body.email || "unknown",
              name: "Authentication Attempt",
              role: "GUEST"
            };
          }
        }

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
          userId: logUser?.id || null,
          userEmail: logUser?.email || "system",
          userName: logUser?.name || "System",
          userRole: logUser?.role || "SYSTEM",
          action: action,
          module: moduleName || (action === "USER_LOGIN" ? "AUTHENTICATION" : "GENERAL"),
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
