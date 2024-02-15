const Joi = require("@hapi/joi");
const isEmpty = require("./is-empty");

const ticketId = Joi.object({
  ticketId: Joi.string().required().messages({
    "string.base": "ticketId field must be a string",
    "string.empty": "ticketId field cannot be empty",
    "any.required": "ticketId field is required"
  })
})

const newSupportTicket = Joi.object({
  title: Joi.string().required().messages({
    "string.base": "title field must be a string",
    "string.empty": "title field cannot be empty",
    "any.required": "title field is required"
  }),
  description: Joi.string().required().messages({
    "string.base": "description field must be a string",
    "string.empty": "description field cannot be empty",
    "any.required": "description field is required"
  }),
  createdBy: Joi.string().email().required().messages({
    "string.base": "createdBy field must be a string",
    "string.empty": "createdBy field cannot be empty",
    "string.email": "createdBy field must be a valid email",
    "any.required": "createdBy field is required"
  }),
  assignedTo: Joi.string().required().messages({
    "string.base": "assignedTo field must be a string",
    "string.empty": "assignedTo field cannot be empty",
    "any.required": "assignedTo field is required"
  }),
  priority: Joi.string().allow('Low', 'Medium', 'High').messages({
    "string.base": "priority field must be a string",
    "string.empty": "priority field cannot be empty",
    "any.only": "priority field must be one of 'Low', 'Medium', or 'High'"
  })
})

const commentSchema = Joi.object({
  author: Joi.string().required().messages({
    "string.base": "author field must be a string",
    "string.empty": "author field cannot be empty",
    "any.required": "author field is required"
  }),
  body: Joi.string().required().messages({
    "string.base": "body field must be a string",
    "string.empty": "body field cannot be empty",
    "any.required": "body field is required"
  }),
  createdAt: Joi.date().default(new Date()),
})

const updateSupportTicket =  Joi.object({
  title: Joi.string().messages({
    "string.base": "title field must be a string",
    "string.empty": "title field cannot be empty",
    "any.required": "title field is required"
  }),
  description: Joi.string().messages({
    "string.base": "description field must be a string",
    "string.empty": "description field cannot be empty",
    "any.required": "description field is required"
  }),
  createdBy: Joi.string().email().messages({
    "string.base": "createdBy field must be a string",
    "string.empty": "createdBy field cannot be empty",
    "string.email": "createdBy field must be a valid email",
    "any.required": "createdBy field is required"
  }),
  assignedTo: Joi.string().messages({
    "string.base": "assignedTo field must be a string",
    "string.empty": "assignedTo field cannot be empty",
    "any.required": "assignedTo field is required"
  }),
  priority: Joi.string().allow('Low', 'Medium', 'High').messages({
    "string.base": "priority field must be a string",
    "string.empty": "priority field cannot be empty",
    "any.only": "priority field must be one of 'Low', 'Medium', or 'High'"
  }),
})

exports.validateCreateSupportTicket = (data) => {
  data.title = !isEmpty(data.title) ? data.title : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.createdBy = !isEmpty(data.createdBy) ? data.createdBy : "";
  data.assignedTo = !isEmpty(data.assignedTo) ? data.assignedTo : "";

  return newSupportTicket.validate(data, {abortEarly: false})
}

exports.validateTicketId = (data) => {
  data.ticketId = !isEmpty(data.ticketId) ? data.ticketId : ""

  return ticketId.validate(data, {abortEarly: false})
}

exports.validateUpdateSupportTicket = (data) => {
  const combinedSchema = updateSupportTicket.concat(ticketId)

  return combinedSchema.validate(data, {abortEarly: false})
}