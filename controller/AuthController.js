//Auth
const { Authentication, Mail } = require("../services");
const catchAsyncError = require("../middleware/catchAsyncError");
const { hasEmptySpace } = require("../utils/helper");
const ErrorHandler = require("../utils/ErrorHandler");
const {
  validateRegisterData,
  loginValidation
} = require("../validation/UserValidation");

/**
 * @route POST api/v1/register
 * @description Register a new user
 * @acess Private
 */

exports.signup = catchAsyncError(async (req, res, next) => {
  const passwordEmptySpace = hasEmptySpace(req.body.password);

  if (passwordEmptySpace) {
    throw new ErrorHandler("Password cannot contain empty space", 400);
  }

  const validateData = await validateRegisterData(req.body);
  if (validateData.error) {
    throw new ErrorHandler(validateData.error, 400);
  }

  const newUser = await Authentication.register(validateData.value);
  const link = `${process.env.APP_BASE_URL}/application?email=${newUser.email}&code=${newUser.code}`;

  Mail.sendVerificationCode(newUser.name, newUser.email, link);

  return res.status(201).json({
    success: true,
    message:
      "Registration successful, please check your email for verification link",
    id: newUser.id
  });
});

/**
 * @route POST api/v1/verify
 * @description Verify a user email
 * @acess Private
 */

exports.accountVerify = catchAsyncError(async (req, res, next) => {
  const { token, name, email, message } = await Authentication.verifyAccount(
    req.body
  );

  // Mail.sendWelcomeEmail(name, email);

  res.status(200).json({
    success: true,
    message,
    token: `Bearer ${token}`
  });
});

/**
 * @route POST /v1/login
 * @description Login a user
 * @access Public
 */

exports.login = catchAsyncError(async (req, res, next) => {
  const validateData = await loginValidation(req.body);

  const response = await Authentication.loginUser(validateData);

  res.status(200).json({ response });
});

/**
 * @route POST api/v1/reset-password
 * @description reset a user password
 * @acess Private
 */
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const validateData = await validateRegisterData(req.body);
  const user = await Authentication.passwordReset(validateData.value);
  const link = `${process.env.APP_BASE_URL}/reset-password?email=${user.email}&code=${user.code}`;
  Mail.sendPasswordCode(user.name, user.email, link);
  return res.status(201).json({
    success: true,
    message: "Please check your email for a reset password code"
  });
});

/**
 * @route POST api/v1/update-password
 * @description update a user password
 * @acess Private
 */

exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const passwordHasEmptySpace = await hasEmptySpace(req.body.password);
  if (passwordHasEmptySpace) {
    throw new ErrorHandler("Password cannot have empty space");
  }
  const { token, email } = await Authentication.passwordUpdate(req.body);

  res.status(200).json({
    success: true,
    message: "Password update successful.",
    token: `Bearer ${token}`
  });
});
