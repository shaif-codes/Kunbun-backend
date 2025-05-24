export const validator = (schema) => {
  return (req, res, next) => {
    const errors = {};

    // Validate body
    if (schema.body) {
      const { error } = schema.body.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: { arrays: false, objects: true }
      });
      if (error) {
        errors.body = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));
      }
    }

    // Validate params
    if (schema.params) {
      const { error } = schema.params.validate(req.params, {
        abortEarly: false,
        allowUnknown: true
      });
      if (error) {
        errors.params = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));
      }
    }

    // Validate query
    if (schema.query) {
      const { error } = schema.query.validate(req.query, {
        abortEarly: false,
        allowUnknown: true
      });
      if (error) {
        errors.query = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));
      }
    }

    // If there are validation errors, return JSON response
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors
      });
    }

    next();
  };
};