const ErrorMessage = require("../constants/error");

exports.canRecordBulkDonations = async function (req, res, next) {
  const permittedAdmin = req.headers["x-recording-authorization"];

  if (
    !permittedAdmin ||
    permittedAdmin !== process.env.DONATION_RECORDING_AUTH_KEY
  ) {
    return res.status(401).json({
      status: false,
      message: ErrorMessage.UNAUTHORIZED
    });
  }

  return next();
};
