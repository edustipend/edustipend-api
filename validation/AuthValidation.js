const Joi = require("@hapi/joi");
const isEmpty = require("./is-empty");
const STATES_OF_ORIGIN = require("../constants/statesOfOrigin");

exports.validateLogin = (data) => {
  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  const userSchema = Joi.object({
    username: Joi.string().email().trim().required().messages({
      "string.email": "Not a valid email",
      "string.base": "Not a valid email",
      "string.empty": "Email field is required",
      "any.required": "Email field is required"
    }),
    password: Joi.string().trim().min(8).required().messages({
      "string.empty": "Password field is required",
      "string.min": "Password must be atleast 8 characters long",
      "any.required": "Password field is required"
    })
  });
  return userSchema.validateAsync(data, { abortEarly: false });
};

exports.validateRegisterData = (data) => {
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.dateOfBirth = !isEmpty(data.dateOfBirth) ? data.dateOfBirth : "";
  data.gender = !isEmpty(data.gender) ? data.gender : "";
  data.stateOfOrigin = !isEmpty(data.stateOfOrigin) ? data.stateOfOrigin : "";
  data.howDidYouHearAboutUs = !isEmpty(data.howDidYouHearAboutUs)
    ? data.howDidYouHearAboutUs
    : "";
  const userSchema = Joi.object({
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
    howDidYouHearAboutUs: Joi.string().required().messages({
      "string.base": "howDidYouHearAboutUs field must be a string",
      "string.empty": "howDidYouHearAboutUs field cannot be empty",
      "any.required": "howDidYouHearAboutUs field is required"
    }).valid('facebook', 'twitter', 'instagram', 'linkedin', 'other'),
    // isAdmin: Joi.boolean(),
    // isVerified: Joi.boolean()
  });
  return userSchema.validate(data, { abortEarly: false });
};

exports.validateUserNameAsEmail = (data) => {
  data.username = !isEmpty(data.username) ? data.username : "";

  const userNameAsEmailSchema = Joi.object({
    username: Joi.string().email().trim().required().messages({
      "string.email": "Not a valid email",
      "string.base": "Not a valid email",
      "string.empty": "Email field is required",
      "any.required": "Email field is required"
    }),
  });
  return userNameAsEmailSchema.validateAsync(data, { abortEarly: false });
};

exports.validateUpdatePassword = (data) => {
  data.password = !isEmpty(data.password) ? data.password : "";

  const passwordUpdateSchema = Joi.object({
    password: Joi.string().trim().min(8).required().messages({
      "string.empty": "Password field is required",
      "string.min": "Password must be atleast 8 characters long",
      "any.required": "Password field is required"
    }),
  });
  return passwordUpdateSchema.validateAsync(data, { abortEarly: false });
};

