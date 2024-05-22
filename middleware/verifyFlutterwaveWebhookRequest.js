const Logger = require("../config/logger");

exports.validateFlutterwaveWebhookRequest = async function (req, res, next) {
  const secretHash = process.env.FLW_SECRET_HASH;
  const signature = req.headers["verif-hash"];
  if (!signature || signature !== secretHash) {
    Logger.error("This request isn't from Flutterwave");
    return res.status(401).end();
  }

  next();
};
