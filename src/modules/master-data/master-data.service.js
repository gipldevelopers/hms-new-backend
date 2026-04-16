const prisma = require("../../database/prisma");

class MasterDataService {
  async getAll(search = "") {
    if (!prisma.masterData) {
      console.error("CRITICAL: prisma.masterData is undefined in service. Available models:", Object.keys(prisma).filter(k => !k.startsWith('$')));
      throw new Error("Database model 'masterData' not initialized in Prisma Client.");
    }
    return await prisma.masterData.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ]
      },
      include: {
        _count: {
          select: { records: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getById(id) {
    return await prisma.masterData.findUnique({
      where: { id },
      include: { records: { orderBy: { createdAt: 'desc' }, take: 100 } }
    });
  }

  async create(data) {
    return await prisma.masterData.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        fields: data.fields
      }
    });
  }

  async update(id, data) {
    return await prisma.masterData.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        fields: data.fields
      }
    });
  }

  async delete(id) {
    return await prisma.masterData.delete({
      where: { id }
    });
  }

  // Dynamic Records CRUD
  async addRecord(masterDataId, recordData) {
    return await prisma.masterDataRecord.create({
      data: {
        masterDataId,
        data: recordData
      }
    });
  }

  async updateRecord(recordId, recordData) {
    return await prisma.masterDataRecord.update({
      where: { id: recordId },
      data: {
        data: recordData
      }
    });
  }

  async deleteRecord(recordId) {
    return await prisma.masterDataRecord.delete({
      where: { id: recordId }
    });
  }
}

module.exports = new MasterDataService();
