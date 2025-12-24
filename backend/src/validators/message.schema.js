const Joi = require("joi");

const createMessageSchema = Joi.object({
  content: Joi.string().trim().min(1).max(1000).required(),
});

const shareTokenSchema = Joi.object({
  shareToken: Joi.string().hex().length(32).required(),
});

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

module.exports = { createMessageSchema, paginationSchema, shareTokenSchema };
