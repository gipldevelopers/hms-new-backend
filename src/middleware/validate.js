// src/middleware/validate.js
const validate = (schemaOrSchemas) => (req, res, next) => {
  // If a direct Joi schema is passed, validate req.body (for backward compatibility)
  if (schemaOrSchemas && typeof schemaOrSchemas.validate === 'function') {
    const { error, value } = schemaOrSchemas.validate(req.body, { abortEarly: false, allowUnknown: true });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        details: error.details.map(d => d.message)
      });
    }
    req.body = value;
    return next();
  }

  // If an object mapping targets (body, query, params) to Joi schemas is passed
  if (schemaOrSchemas && typeof schemaOrSchemas === 'object') {
    const targets = ['body', 'query', 'params'];
    for (const target of targets) {
      if (schemaOrSchemas[target]) {
        const { error, value } = schemaOrSchemas[target].validate(req[target], {
          abortEarly: false,
          allowUnknown: true
        });
        if (error) {
          return res.status(400).json({
            success: false,
            message: `Invalid ${target}: ${error.details[0].message}`,
            details: error.details.map(d => d.message)
          });
        }
        req[target] = value;
      }
    }
    return next();
  }

  next();
};

module.exports = validate;