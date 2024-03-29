const Joi = require("@hapi/joi");
const isEmpty = require("./is-empty");
const STATES_OF_ORIGIN = require("../constants/statesOfOrigin");
const ApplicationStatus = require("../constants/applicationStatus");

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

  const firstStipendApplicationSchema = Joi.object({
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
    gender: Joi.string()
      .required()
      .messages({
        "string.base": "gender field must be a string",
        "string.empty": "gender field cannot be empty",
        "any.required": "gender field is required"
      })
      .valid("male", "female", "non-binary"),
    socialMediaHandles: Joi.object()
      .keys({
        facebook: Joi.string(),
        instagram: Joi.string(),
        linkedin: Joi.string(),
        //TODO: Remove twitter
        twitter: Joi.string(),
        other: Joi.string(),
        x: Joi.string()
      })
      .optional(),
    stateOfOrigin: Joi.string()
      .required()
      .messages({
        "string.base": "stateOfOrigin field must be a string",
        "string.empty": "stateOfOrigin field cannot be empty",
        "any.required": "stateOfOrigin field is required"
      })
      .custom((value, helper) => {
        if (!STATES_OF_ORIGIN[value]) {
          return helper.message("Invalid state of origin provided");
        }
        return value;
      }),
    /** Stipend Application Validation */
    howDidYouHearAboutUs: Joi.string()
      .required()
      .messages({
        "string.base": "howDidYouHearAboutUs field must be a string",
        "string.empty": "howDidYouHearAboutUs field cannot be empty",
        "any.required": "howDidYouHearAboutUs field is required"
      })
      .valid(
        "facebook",
        "twitter",
        "instagram",
        "other",
        "linkedin",
        "int'l women's day",
        "google search",
        "community",
        "x"
      ),
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
      })
  });
  return firstStipendApplicationSchema.validate(data, { abortEarly: false });
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

  const stipendApplicationSchema = Joi.object({
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
    //TODO: Move this userId from request body to header
    userId: Joi.string().alphanum().required().messages({
      "string.base": "userId field must be a string",
      "string.empty": "userId field cannot be empty",
      "any.required": "userId field is required"
    })
  });
  return stipendApplicationSchema.validate(data, { abortEarly: false });
};

exports.validateUpdateStipendApplication = (data) => {
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
  data.applicationId = data.applicationId ?? "";

  const stipendUpdateApplicationSchema = Joi.object({
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
    applicationId: Joi.string().alphanum().required().messages({
      "string.base": "applicationId field must be a string",
      "string.empty": "applicationId field cannot be empty",
      "any.required": "applicationId field is required"
    })
  });
  return stipendUpdateApplicationSchema.validate(data, { abortEarly: false });
};

exports.validateOneClickApplyStipendApplication = (data) => {
  const oneClickApplyStipendApplicationSchema = Joi.object({
    futureHelpFromUser: Joi.when("parentApplication", {
      is: Joi.string(),
      then: Joi.string().allow(null, ""),
      otherwise: Joi.string().required().messages({
        "string.base": "futureHelpFromUser field must be a string",
        "string.empty": "futureHelpFromUser field cannot be empty",
        "any.required": "futureHelpFromUser field is required"
      })
    }),
    potentialBenefits: Joi.when("parentApplication", {
      is: Joi.string(),
      then: Joi.string().allow(null, ""),
      otherwise: Joi.string().required().messages({
        "string.base": "potentialBenefits field must be a string",
        "string.empty": "potentialBenefits field cannot be empty",
        "any.required": "potentialBenefits field is required"
      })
    }),
    reasonForRequest: Joi.when("parentApplication", {
      is: Joi.string(),
      then: Joi.string().allow(null, ""),
      otherwise: Joi.string().required().messages({
        "string.base": "reasonForRequest field must be a string",
        "string.empty": "reasonForRequest field cannot be empty",
        "any.required": "reasonForRequest field is required"
      })
    }),
    stepsTakenToEaseProblem: Joi.when("parentApplication", {
      is: Joi.string(),
      then: Joi.string().allow(null, ""),
      otherwise: Joi.string().required().messages({
        "string.base": "stepsTakenToEaseProblem field must be a string",
        "string.empty": "stepsTakenToEaseProblem field cannot be empty",
        "any.required": "stepsTakenToEaseProblem field is required"
      })
    }),
    stipendCategory: Joi.when("parentApplication", {
      is: Joi.string(),
      then: Joi.string().allow(null, ""),
      otherwise: Joi.string()
        .required()
        .valid("laptop", "course", "data")
        .messages({
          "string.base": "stipendCategory field must be a string",
          "string.empty": "stipendCategory field cannot be empty",
          "any.required": "stipendCategory field is required"
        })
    }),
    parentApplication: Joi.string().alphanum().required().messages({
      "string.base": "parentApplication field must be a string",
      "string.empty": "parentApplication field cannot be empty",
      "any.required": "parentApplication field is required"
    }),
    //TODO: Move this userId from request body to header
    userId: Joi.string().alphanum().required().messages({
      "string.base": "userId field must be a string",
      "string.empty": "userId field cannot be empty",
      "any.required": "userId field is required"
    })
  });
  return oneClickApplyStipendApplicationSchema.validate(data, {
    abortEarly: false
  });
};

exports.validateAdminUpdateStipendApplicationStatus = (data) => {
  // TODO: Update this to take in time duration
  const updateStipendApplicationStatusPayload = Joi.object({
    status: Joi.string()
      .required()
      .valid(
        ApplicationStatus.IN_REVIEW,
        ApplicationStatus.RECEIVED,
        ApplicationStatus.APPROVED
      )
      .messages({
        "string.base": "status field must be a string",
        "string.empty": "status field cannot be empty",
        "any.required": "status field is required"
      })
  });
  return updateStipendApplicationStatusPayload.validate(data, {
    abortEarly: false
  });
};

exports.validateBatchApproveRequest = async (data) => {
  data.applicationIds = !isEmpty(data.applicationIds)
    ? data.applicationIds
    : [];
  const batchAproveApplicationRequestSchema = Joi.object({
    applicationIds: Joi.array().items(
      Joi.string().alphanum().required().messages({
        "string.base": "Application Ids Must be a string",
        "string.empty": "Applicatin Id field cannot be empty"
      })
    )
    // startDate: Joi.date().format('YYYY-MM-DD').raw(),
    // endDate: Joi.date().format('YYYY-MM-DD').raw()
  });
  return await batchAproveApplicationRequestSchema.validateAsync(data, {
    abortEarly: false
  });
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
