const { validationResult } = require('express-validator');

// @desc Middleware for validate the routes
const validation = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(400).json({ errors: error.array() });
  next();
};

module.exports = validation;
