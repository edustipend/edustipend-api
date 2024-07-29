const ErrorMessage = require("../constants/error");

exports.canRecordManualDonations = async function (req, res, next) {
  const permittedAdmin = req.headers["x-manual-tranx-authorization"];

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
