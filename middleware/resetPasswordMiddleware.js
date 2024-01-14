const Logger = require("../config/logger");
const User = require("../services/User");
const { verifyJWTToken } = require("../utils/generateJwtToken");
const { hasEmptySpace } = require("../utils/helper");
const {
  validateUserNameAsEmail,
  validateUpdatePassword
} = require("../validation/AuthValidation");

exports.resetPasswordMiddleware = async function (req, res, next) {
  const validateData = await validateUserNameAsEmail({
    username: req.body.email || req.body.username
  });

  if (validateData.error) {
    //TODO: Remove hardcoded error statuses
    throw new ErrorHandler(validateData.error, 422);
  }

  const user = await User.findByUserName(validateData.username);
  if (!user) {
    return res.status(400).json({
      message: "if the user exists, an email will be sent to them"
    });
  }

  res.locals.verifiedUser = user;
  next();
};

exports.updatePasswordMiddleware = async function (req, res, next) {
  const passwordHasEmptySpace = hasEmptySpace(req.body.password);
  if (passwordHasEmptySpace) {
    throw new ErrorHandler("Password cannot have empty space");
  }

  const validateData = await validateUpdatePassword({
    password: req.body.password
  });

  if (validateData.error) {
    //TODO: Remove hardcoded error statuses
    throw new ErrorHandler(validateData.error, 422);
  }

  // Get the token from the request body, params
  // TODO: Update this to read from the headers
  const resetToken = req.body.resetToken || req.query.resetToken;

  try {
    let verified = verifyJWTToken(resetToken);

    // Verify that ID in token matches person making the request
    if (verified.id !== req.body.userId) {
      return res.status(401).json({
        message: "Unauthorized for this operation",
        error: true
      });
    }

    const user = await User.findByUserName(verified.username);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true
      });
    }

    res.locals.verifiedUser = user;
  } catch (err) {
    Logger.error(err);
    return res.status(422).json({
      message: "invalid or expired token",
      error: true
    });
  }

  next();
};
