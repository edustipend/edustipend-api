const Logger = require("../config/logger");
const TokenExpiration = require("../constants/tokenExpiration");
const { Authentication, Mail } = require("../services");
const User = require("../services/User");
const { verifyJWTToken } = require("../utils/generateJwtToken");
const { getVerificationLink } = require("../utils/helper");

const generateVerificationTokenAndSendMail = async (user) => {
  const { token } = await Authentication.getTokenForAuthenticatedUser(
    user.email,
    user,
    TokenExpiration.THIRTY_MINUTES
  );
  const link = getVerificationLink(token);
  try {
    Mail.resendVerificationEmail(user.name, user.email, link);
  } catch (error) {
    throw error;
  }
};

exports.verifyUserMiddleware = async function (req, res, next) {
  let verifyToken = req.query.jwt;
  let user;

  if (!verifyToken) {
    return res.status(400).json({
      success: false,
      error: "Missing required jwt"
    });
  }

  try {
    const verified = verifyJWTToken(verifyToken, { ignoreExpiration: true });
    const userName = verified?.username;
    if (userName) {
      user = await User.findByUserName(userName);
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
    }

    res.locals.verifiedUserName = verified.username;
  } catch (err) {
    Logger.error(err);
  };

  try {
    // Check if token has expired
    verifyJWTToken(verifyToken);
    next();
  } catch (err) {
    Logger.error(err);

    // We are sending user a new verify email with token because previous has expired
    try {
      await generateVerificationTokenAndSendMail(user);
    } catch (error) {
      Logger.error(error);
      return res.status(500).json({
        message: "Error resending verify email",
        error
      });
    }
    return res.status(498).json({
      message: "Expired token - a new verify email has been sent",
      error: true
    });
  }
};

exports.verifyLoggedInUserMiddleware = async function (req, res, next) {
  let verifyToken = req.query.jwt;
  let userName = req.body.email || req.body.username;
  let user;

  //TODO: Add more validation to check that user id matches requester
  if (!verifyToken) {
    return res.status(401).json({
      success: false,
      error: "User is unauthorized to perform this operation"
    });
  }

  try {
    if (userName) {
      user = await User.findByUserName(userName);
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
    }

    try {
      const verified = verifyJWTToken(verifyToken);
      res.locals.verifiedUser = verified;
    } catch (error) {
      Logger.error(error);
      return res.status(400).json({
        message: "Expired session, user needs to login again",
        error
      });
    }
    next();
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({
      message: "Error sending verify email to logged in user",
      error
    });
  }
};
