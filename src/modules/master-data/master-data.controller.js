const masterDataService = require('./master-data.service');

class MasterDataController {
  async getAll(req, res) {
    try {
      const { search } = req.query;
      const data = await masterDataService.getAll(search);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await masterDataService.getById(id);
      if (!data) return res.status(404).json({ message: "Master data not found" });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const data = await masterDataService.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).json({ message: "Schema code must be unique" });
      }
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await masterDataService.update(id, req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await masterDataService.delete(id);
      res.status(200).json({ message: "Master data deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Records
  async addRecord(req, res) {
    try {
      const { id } = req.params; // masterDataId
      const record = await masterDataService.addRecord(id, req.body);
      res.status(201).json(record);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateRecord(req, res) {
    try {
      const { recordId } = req.params;
      const record = await masterDataService.updateRecord(recordId, req.body);
      res.status(200).json(record);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteRecord(req, res) {
    try {
      const { recordId } = req.params;
      await masterDataService.deleteRecord(recordId);
      res.status(200).json({ message: "Record deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new MasterDataController();
