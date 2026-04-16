const prisma = require('../../database/prisma');

class TemplateService {
  async getAll(search = '') {
    if (!prisma.template) {
      console.error("CRITICAL: prisma.template is undefined. Available models:", Object.keys(prisma).filter(k => !k.startsWith('$')));
      throw new Error("Database model 'template' not initialized in Prisma Client.");
    }
    return await prisma.template.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } }
        ]
      } : {},
      orderBy: { createdAt: 'desc' }
    });
  }

  async getById(id) {
    return await prisma.template.findUnique({
      where: { id }
    });
  }

  async create(data) {
    return await prisma.template.create({
      data: {
        name: data.name,
        code: data.code,
        category: data.category,
        blocks: data.blocks
      }
    });
  }

  async update(id, data) {
    return await prisma.template.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code,
        category: data.category,
        blocks: data.blocks
      }
    });
  }

  async delete(id) {
    return await prisma.template.delete({
      where: { id }
    });
  }
}

module.exports = new TemplateService();
