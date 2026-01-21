const joi = require("joi");
const { search } = require("../routes/task");

const taskSchemaJoi = joi.object({
  description: joi.string().optional(),
  createdBy: joi.string().optional(),
  UpdatedAt: joi.date().optional(),
  personDoing: joi.string().optional(),
  completedAt: joi.date().optional(),
  status: joi.string().optional(),
});

const taskFiltersPayload = joi.object({
  search: joi.string(),
  limit: joi.number().default(2),
  page: joi.number().default(1),
  filters: joi.object({
    status: joi.string().optional(),
    createdAt: joi.date().optional(),
    updatedAt: joi.date(),
    lastCompletionDate: joi.date(),
  }),
});

module.exports = {
  taskSchemaJoi,
};
