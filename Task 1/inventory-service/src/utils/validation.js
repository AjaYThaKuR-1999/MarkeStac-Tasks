const Joi = require('joi');
const { logger } = require('../utils/logger');

const itemSchema = {
  create: Joi.object({
    name: Joi.string().trim().required().messages({
      'any.required': 'Name is required',
      'string.base': 'Name must be a string'
    }),
    quantity: Joi.number().integer().min(0).required().messages({
      'any.required': 'Quantity is required',
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be ≥ 0'
    }),
    price: Joi.number().greater(0).required().messages({
      'any.required': 'Price is required',
      'number.base': 'Price must be a number',
      'number.greater': 'Price must be > 0'
    })
  }),

  update: Joi.object({
    name: Joi.string().trim().messages({
      'string.base': 'Name must be a string'
    }),
    quantity: Joi.number().integer().min(0).messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be ≥ 0'
    }),
    price: Joi.number().greater(0).messages({
      'number.base': 'Price must be a number',
      'number.greater': 'Price must be > 0'
    })
  }).min(1) // At least one field is required for update
};

const validateItem = (action, data) => {
  const schema = itemSchema[action];
  if (!schema) {
    const message = `No Joi schema found for action: ${action}`;
    logger.error(message);
    throw new Error(message);
  }

  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    const messages = error.details.map(e => e.message);
    logger.warn(`Validation failed for action: ${action}`, {
      input: data,
      errors: messages
    });

    return {
      isValid: false,
      error: {
        message: 'Validation error',
        details: messages
      }
    };
  }

  return { isValid: true };
};

module.exports = validateItem;