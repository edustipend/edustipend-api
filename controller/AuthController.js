//Auth
const { Authentication, Mail, User } = require("../services");
const catchAsyncError = require("../middleware/catchAsyncError");
const { hasEmptySpace } = require("../utils/helper");
const ErrorHandler = require("../utils/ErrorHandler");
const {
  validateRegisterData,
  validateLogin: loginValidation
} = require("../validation/AuthValidation");
const Logger = require("../config/logger");

/**
 * @route POST api/v1/register
 * @description Register a new user
 * @deprecated
 * @acess Private
 */
exports.register = catchAsyncError(async (req, res) => {
  const passwordEmptySpace = hasEmptySpace(req.body.password);
  if (passwordEmptySpace) {
    throw new ErrorHandler("Password cannot contain empty space", 400);
  }

  const validateData = validateRegisterData(req.body);
  if (validateData.error) {
    throw new ErrorHandler(validateData.error, 400);
  }

  const { email } = req.body;
  let newUser;

  try {
    newUser = await User.createUser(validateData.value);
    const { token, id } = await Authentication.getTokenForAuthenticatedUser(
      email,
      newUser
    );

    if (token && id) {
      const link = `${process.env.APP_BASE_URL}/application?jwt=${token}`;
      //TODO: Mail.sendVerificationCode(name, email, link);

      return res.status(201).json({
        success: true,
        message:
          "Registration successful, please check your email for verification link",
        id
      });
    } else {
      return res.status(500).json({
        error: "Error generating user token"
      });
    }
  } catch (error) {
    return res.status(500).json({
      error
    });
  }
});

/**
 * @route POST /v1/login
 * @description Login a user
 * @access Public
 */
exports.login = catchAsyncError(async (req, res) => {
  const validateData = await loginValidation(req.body);
  try {
    const response = await Authentication.loginUser(validateData);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});

/**
 * @route POST /v1/logout
 * @description Logs out a user
 * @access Public
 */
exports.logout = catchAsyncError(async (req, res) => {
  try {
    req.logout();
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

/**
 * @route POST api/v1/reset-password
 * @description reset a user password
 * @acess Private
 */
exports.resetPassword = catchAsyncError(async (_, res) => {
  const verifiedUser = res.locals.verifiedUser;

  try {
    const resetPassWordRes = await Authentication.resetPassword(verifiedUser);
    const link = `${process.env.APP_BASE_URL}/reset-password?resetToken=${resetPassWordRes?.token}`;

    try {
      Mail.sendResetPasswordEmail(verifiedUser.name, verifiedUser.email, link);
    } catch (error) {
      Logger.error(error);
      res.status(500).json({
        message: "Error sending password reset email",
        error
      });
    }

    return res.status(201).json({
      success: true,
      message: "Please check your email for the password reset link."
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});

/**
 * @route POST api/v1/update-password
 * @description update a user password
 * @acess Private
 */
exports.updatePassword = catchAsyncError(async (req, res) => {
  try {
    await User.updatePassword(req.body.password, res.locals.verifiedUser);
    res.status(200).json({
      success: true,
      message: "Password update successful."
    });
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      error,
      message: "Error updating password"
    });
  }
});
