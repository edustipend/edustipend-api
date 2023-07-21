const Joi = require("@hapi/joi");
const isEmpty = require("./is-empty");

exports.validateWaitlistEntry = (data) => {
  data.email = isEmpty(data.email) ? "" : data.email

  const waitlistSchema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.base": "email field must be a string",
      "string.empty": "email field cannot be empty",
      "string.email": "email must be a valid email",
      "any.required": "email field is required"
    }),
  })

  return waitlistSchema.validate(data, { abortEarly: false })
}