import { validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formattedErrors = errors.array().map(err => ({
    field: err.param,
    message: err.msg
  }));

  return res.status(400).json({
    status: 'fail',
    errors: formattedErrors
  });
};
