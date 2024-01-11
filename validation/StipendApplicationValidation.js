const Joi = require("@hapi/joi");
const isEmpty = require("./is-empty");
const STATES_OF_ORIGIN = require("../constants/statesOfOrigin");

exports.validateFirstStipendApplication = (data) => {
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.dateOfBirth = !isEmpty(data.dateOfBirth) ? data.dateOfBirth : "";
  data.gender = !isEmpty(data.gender) ? data.gender : "";
  data.stateOfOrigin = !isEmpty(data.stateOfOrigin) ? data.stateOfOrigin : "";
  data.howDidYouHearAboutUs = !isEmpty(data.howDidYouHearAboutUs)
    ? data.howDidYouHearAboutUs
    : "";
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

  const initialRequestSchema = Joi.object({
    /** User Validation */
    name: Joi.string().required().messages({
      "string.base": "name field must be a string",
      "string.empty": "name field cannot be empty",
      "any.required": "name field is required"
    }),
    email: Joi.string().email().required().messages({
      "string.base": "email field must be a string",
      "string.empty": "email field cannot be empty",
      "string.email": "email must be a valid email",
      "any.required": "email field is required"
    }),
    password: Joi.string().trim().min(8).required().messages({
      "string.empty": "Password field is required",
      "string.min": "Password must be atleast 8 characters long",
      "any.required": "Password field is required"
    }),
    confirmPassword: Joi.string()
      .trim()
      .equal(Joi.ref("password"))
      .messages({ "any.only": "Password does not Match!" }),
    dateOfBirth: Joi.string().required().messages({
      "string.base": "dateOfBirth field must be a string",
      "string.empty": "dateOfBirth field cannot be empty",
      "any.required": "dateOfBirth field is required"
    }),
    gender: Joi.string().required().messages({
      "string.base": "gender field must be a string",
      "string.empty": "gender field cannot be empty",
      "any.required": "gender field is required"
    }).valid('male', 'female', 'binary'),
    stateOfOrigin: Joi.string().required().messages({
      "string.base": "stateOfOrigin field must be a string",
      "string.empty": "stateOfOrigin field cannot be empty",
      "any.required": "stateOfOrigin field is required"
    }).custom((value, helper) => {
      if (!STATES_OF_ORIGIN[value]) {
        return helper.message("Invalid state of origin provided");
      }
      return value;
    }),
    /** Stipend Application Validation */
    howDidYouHearAboutUs: Joi.string().required().messages({
      "string.base": "howDidYouHearAboutUs field must be a string",
      "string.empty": "howDidYouHearAboutUs field cannot be empty",
      "any.required": "howDidYouHearAboutUs field is required"
    }).valid('facebook', 'twitter', 'instagram', 'linkedin', 'other'),
    futureHelpFromUser: Joi.string().required().messages({
      "string.base": "futureHelpFromUser field must be a string",
      "string.empty": "futureHelpFromUser field cannot be empty",
      "any.required": "futureHelpFromUser field is required"
    }),
    potentialBenefits: Joi.string().required().messages({
      "string.base": "potentialBenefits field must be a string",
      "string.empty": "potentialBenefits field cannot be empty",
      "any.required": "potentialBenefits field is required"
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
    stipendCategory: Joi.string()
      .required()
      .valid("laptop", "course", "data")
      .messages({
        "string.base": "stipendCategory field must be a string",
        "string.empty": "stipendCategory field cannot be empty",
        "any.required": "stipendCategory field is required"
      }),
  });
  return initialRequestSchema.validate(data, { abortEarly: false });
};

exports.validateStipendApplication = (data) => {
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
    futureHelpFromUser: Joi.string().required().messages({
      "string.base": "futureHelpFromUser field must be a string",
      "string.empty": "futureHelpFromUser field cannot be empty",
      "any.required": "futureHelpFromUser field is required"
    }),
    potentialBenefits: Joi.string().required().messages({
      "string.base": "potentialBenefits field must be a string",
      "string.empty": "potentialBenefits field cannot be empty",
      "any.required": "potentialBenefits field is required"
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
    stipendCategory: Joi.string()
      .required()
      .valid("laptop", "course", "data")
      .messages({
        "string.base": "stipendCategory field must be a string",
        "string.empty": "stipendCategory field cannot be empty",
        "any.required": "stipendCategory field is required"
      }),
    user: Joi.object({
      _id: Joi.string().alphanum().required(),
      email: Joi.string().email().required().messages({
        "string.base": "email field must be a string",
        "string.empty": "email field cannot be empty",
        "string.email": "email must be a valid email",
        "any.required": "email field is required"
      }),
      username: Joi.string().email().required().messages({
        "string.base": "email field must be a string",
        "string.empty": "email field cannot be empty",
        "string.email": "email must be a valid email",
        "any.required": "email field is required"
      }),
      // email: Joi.string()
      //   .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    })
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
