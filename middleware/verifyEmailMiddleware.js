const Logger = require("../config/logger");
const TokenExpiration = require("../constants/tokenExpiration");
const { Authentication, Mail } = require("../services");
const User = require("../services/User");
const { verifyJWTToken } = require("../utils/generateJwtToken");
const { getVerificationLink } = require("../utils/helper");
const { validateUserNameAsEmail } = require("../validation/AuthValidation");

const generateVerificationTokenAndSendMail = async (user) => {
  const { token } = await Authentication.getTokenForAuthenticatedUser(
    user.email,
    user,
    TokenExpiration.THIRTY_MINUTES
  );
  const link = getVerificationLink(token);

  //TODO: Add email service to send verify email
  // Mail.sendPasswordCode(user.name, user.email, link);
  return link;
};

exports.verifyEmailMiddleware = async function (req, res, next) {
  const validateData = await validateUserNameAsEmail({
    username:
      req.body.email ||
      req.body.username ||
      req.query.username ||
      req.query.email
  });

  if (validateData.error) {
    //TODO: Remove hardcoded error statuses
    throw new ErrorHandler(validateData.error, 422);
  }

  const user = await User.findByUserName(validateData.username);
  if (!user) {
    return res.status(400).json({
      error: "User does not exist"
    });
  }

  if (user.isVerified) {
    return res.status(200).json({
      success: false,
      message: "User is already verified"
    });
  }

  let verifyToken = req.query.jwt;
  if (!verifyToken) {
    return res.status(400).json({
      success: false,
      error: "Missing required jwt"
    });
  }

  try {
    let verified = verifyJWTToken(verifyToken);
    res.locals.verifiedUser = user;
    res.locals.verifiedUserName = verified.username;
    next();
  } catch (err) {
    Logger.error(err);

    // We are sending user a new token because previous has expired
    link = await generateVerificationTokenAndSendMail(user);
    return res.status(498).json({
      message: "Expired token - a new verify email has been sent",
      error: true,
      link
    });
  }
};
