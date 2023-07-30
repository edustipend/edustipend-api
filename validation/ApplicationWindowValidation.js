const Joi = require("@hapi/joi");
const isEmpty = require("./is-empty");

exports.validateApplicationWindow = (data) => {
  data.startDate = !isEmpty(data.startDate) ? data.startDate : "";
  data.endDate = !isEmpty(data.endDate) ? data.endDate : "";

  const applicationWindowSchema = Joi.object({
    startDate: Joi.date()
      .iso() // Ensures the date is in ISO format (YYYY-MM-DD)
      .required()
      .messages({
        "any.required": "Start date is required.",
        "date.base": "Start date must be a valid date.",
        "date.format": 'Start date must be in the format "YYYY-MM-DD".'
      }),
    endDate: Joi.date()
      .iso()
      .greater(Joi.ref("startDate")) // Ensures endDate is greater than startDate
      .required()
      .messages({
        "any.required": "End date is required.",
        "date.base": "End date must be a valid date.",
        "date.format": 'End date must be in the format "YYYY-MM-DD".',
        "date.greater": "End date must be greater than the start date."
      })
  });
  return applicationWindowSchema.validate(data, { abortEarly: false });
};
