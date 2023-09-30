const Joi = require("@hapi/joi");
const isEmpty = require("./is-empty");

exports.validateWaitlistEntry = (data) => {
  data.email = isEmpty(data.email) ? "" : data.email;
  data.name = !isEmpty(data.name) ? data.name : "";
  data.howDidYouHearAboutUs = !isEmpty(data.howDidYouHearAboutUs)
    ? data.howDidYouHearAboutUs
    : "";

  const waitlistSchema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.base": "email field must be a string",
      "string.empty": "email field cannot be empty",
      "string.email": "email must be a valid email",
      "any.required": "email field is required"
    }),
    name: Joi.string().required().messages({
      "string.base": "name field must be a string",
      "string.empty": "name field cannot be empty",
      "any.required": "name field is required"
    }),
    howDidYouHearAboutUs: Joi.string().required().messages({
      "string.base": "howDidYouHearAboutUs field must be a string",
      "string.empty": "howDidYouHearAboutUs field cannot be empty",
      "any.required": "howDidYouHearAboutUs field is required"
    })
  });

  return waitlistSchema.validate(data, { abortEarly: false });
};
