const jwt = require('jsonwebtoken');
const prisma = require('../database/prisma');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Please authenticate.'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    const primaryRole = req.user.role;
    const consoleRoles = req.user.isRestricted ? [] : (req.user.consoleRoles || []);

    const isAuthorized = roles.includes(primaryRole) || 
                        consoleRoles.some(r => roles.includes(r));

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Access is denied.'
      });
    }
    next();
  };
};

module.exports = {
  auth,
  authorize
};
