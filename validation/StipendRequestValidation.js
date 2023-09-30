const Joi = require("@hapi/joi");
const isEmpty = require("./is-empty");

exports.validateStipendRequest = (data) => {
  data.email = !isEmpty(data.email) ? data.email : "";
  data.stipendCategory = !isEmpty(data.stipendCategory)
    ? data.stipendCategory
    : "";
  data.reasonForRequest = !isEmpty(data.reasonForRequest)
    ? data.reasonForRequest
    : "";
  data.stepsTakenToEaseProblem = !isEmpty(data.stepsTakenToEaseProblem)
    ? data.stepsTakenToEaseProblem
    : "";
  data.potentialBenefits = !isEmpty(data.potentialBenefits)
    ? data.potentialBenefits
    : "";
  data.futureHelpFromUser = !isEmpty(data.futureHelpFromUser)
    ? data.futureHelpFromUser
    : "";

  const stipendRequestSchema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.base": "email field must be a string",
      "string.empty": "email field cannot be empty",
      "string.email": "email must be a valid email",
      "any.required": "email field is required"
    }),
    stipendCategory: Joi.string()
      .required()
      .valid("laptop", "course", "data")
      .messages({
        "string.base": "stipendCategory field must be a string",
        "string.empty": "stipendCategory field cannot be empty",
        "any.required": "stipendCategory field is required"
      }),
    reasonForRequest: Joi.string().required().messages({
      "string.base": "reasonForRequest field must be a string",
      "string.empty": "reasonForRequest field cannot be empty",
      "any.required": "reasonForRequest field is required"
    }),
    stepsTakenToEaseProblem: Joi.string().required().messages({
      "string.base": "stepsTakenToEaseProblem field must be a string",
      "string.empty": "stepsTakenToEaseProblem field cannot be empty",
      "any.required": "stepsTakenToEaseProblem field is required"
    }),
    potentialBenefits: Joi.string().required().messages({
      "string.base": "potentialBenefits field must be a string",
      "string.empty": "potentialBenefits field cannot be empty",
      "any.required": "potentialBenefits field is required"
    }),
    futureHelpFromUser: Joi.string().required().messages({
      "string.base": "futureHelpFromUser field must be a string",
      "string.empty": "futureHelpFromUser field cannot be empty",
      "any.required": "futureHelpFromUser field is required"
    }),
    id: Joi.number(),
    isApproved: Joi.boolean(),
    userId: Joi.number()
  });
  return stipendRequestSchema.validate(data, { abortEarly: false });
};

exports.stipendRequestIdsValidation = async (data) => {
  data.stipendRequestIds = !isEmpty(data.stipendRequestIds)
    ? data.stipendRequestIds
    : [];
  const stipendRequestIdsValidationSchema = Joi.object({
    stipendRequestIds: Joi.array()
      .items(
        Joi.number().min(1).messages({
          "number.base": "Application Ids Must be a number",
          "number.min": "Application Ids must be 1 or greater"
        })
      )
      .has(Joi.number().min(1))
      .messages({
        "array.base": "stipendIds must be an array",
        "array.hasKnown": "An application must have an id"
      })
  });
  return await stipendRequestIdsValidationSchema.validateAsync(data, {
    abortEarly: false
  });
};
