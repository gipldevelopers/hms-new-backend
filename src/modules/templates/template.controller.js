const templateService = require('./template.service');

class TemplateController {
  async getAll(req, res) {
    try {
      const { search } = req.query;
      const templates = await templateService.getAll(search);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const template = await templateService.getById(req.params.id);
      if (!template) return res.status(404).json({ message: 'Template not found' });
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const template = await templateService.create(req.body);
      res.status(201).json(template);
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Template code must be unique' });
      }
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const template = await templateService.update(req.params.id, req.body);
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await templateService.delete(req.params.id);
      res.json({ message: 'Template deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new TemplateController();
