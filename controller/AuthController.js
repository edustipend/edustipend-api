//Auth
const { Authentication, Mail } = require("../services");
const catchAsyncError = require("../middleware/catchAsyncError");
const { hasEmptySpace } = require("../utils/helper");
const ErrorHandler = require("../utils/ErrorHandler");
const { validateRegisterData } = require("../validation/UserValidation");

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

  // Mail.sendWelcomeEmail(name, email);

  res.status(200).json({
    success: true,
    message: "Account Verification successful.",
    token: `Bearer ${token}`
  });
});