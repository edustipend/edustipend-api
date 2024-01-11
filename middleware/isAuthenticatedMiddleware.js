const Logger = require("../config/logger");
const ErrorMessage = require("../constants/error");
const { verifyJWTToken } = require("../utils/generateJwtToken");

exports.isAuthenticated = async function (req, res, next) {
  // TODO: Update this to read from the headers
  const authToken = req.body.authToken || req.query.jwt;

  try {
    let verified = verifyJWTToken(authToken);

    // Verify that ID in token matches person making the request
    if (verified.id !== req.body.userId) {
      Logger.error("Mismatch between requesting id and token id");
      return res.status(401).json({
        message: ErrorMessage.UNAUTHORIZED,
        error: true
      });
    }
  } catch (err) {
    Logger.error(err);
    return res.status(401).json({
      message: ErrorMessage.UNAUTHORIZED,
      error: true
    });
  }

  next();
};
