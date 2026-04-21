const prisma = require('../../database/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, branchId: user.branchId },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '24h' }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      branchId: user.branchId,
      consoleRoles: user.consoleRoles
    },
    authtoken: token
  };
};

module.exports = {
  login
};
