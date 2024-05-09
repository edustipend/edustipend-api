const Logger = require("../config/logger");

exports.flutterwaveWebhookValidator = async function (req, res, next) {
  const secretHash = process.env.FLW_SECRET_HASH;
  const signature = req.headers["verif-hash"];
  if (!signature || signature !== secretHash) {
    // This request isn't from Flutterwave; discard
    Logger.error("This request isn't from Flutterwave");
    return res.status(401).end();
  }

  next();
};
