const { getTenantClient } = require('../database/tenant-manager');

/**
 * Middleware to resolve the tenant from the request and attach the database client
 */
const tenantResolver = async (req, res, next) => {
  const branchId = req.headers['x-branch-id'];

  if (!branchId) {
    // If it's a superadmin request that doesn't target a branch, we might skip
    // Or if it's a login request where branch isn't known yet.
    return next();
  }

  try {
    const tenantDb = await getTenantClient(branchId);
    req.tenantDb = tenantDb;
    req.branchId = branchId;
    next();
  } catch (error) {
    console.error(`Tenant Resolution Error [${branchId}]:`, error.message);
    return res.status(404).json({
      success: false,
      message: "Infrastructure routing failed: Branch database unreachable or invalid."
    });
  }
};

module.exports = tenantResolver;
