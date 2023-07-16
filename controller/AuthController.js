//Auth
const { Authentication, Mail } = require("../services");
const catchAsyncError = require("../middleware/catchAsyncError");
const { hasEmptySpace } = require("../utils/helper");
const ErrorHandler = require("../utils/ErrorHandler");
const { validateRegisterData } = require("../validation/UserValidation");
const { authenticate } = require("passport");
const randomSixDigits = require("../utils/helper");
const { error } = require("@hapi/joi/lib/base");

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

  const newUser = await Authentication.register(validateData.value);
  const link = `${process.env.APP_BASE_URL}/v1/verify?code=${newUser.code}`;

  Mail.sendVerificationCode(newUser.name, newUser.email, link);

  return res.status(201).json({
    success: true,
    message:
      "Registration successful, please check your email for verification link"
  });
});

/**
 * @route POST api/v1/verify
 * @description Verify a user email
 * @acess Private
 */

exports.accountVerify = catchAsyncError(async (req, res, next) => {
  const { token, name, email } = await Authentication.verifyAccount(req.body);

  res.status(200).json({
    success: true,
    message: "Account Verification successful.",
    token: `Bearer ${token}`
  });
});

/**
 * @route POST api/v1/verify
 * @description Verify a user email
 * @acess Private
 */
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const validateData = await validateRegisterData(req.body);
  const user = await Authentication.passwordReset(validateData.value);
  const link = `${process.env.APP_BASE_URL}/v1/reset-password?code=${user.code}`;
  Mail.sendVerificationCode(user.name, user.email, link);
  return res.status(201).json({
    success: true,
    message: "Please check your email for a reset password code"
  });
});

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
