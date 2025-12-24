const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().trim().alphanum().min(3).max(30).required(),
  email: Joi.string().trim().email().max(254).lowercase().required(),
  password: Joi.string().min(8).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().max(254).lowercase().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
