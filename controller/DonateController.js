const { Donate } = require("../services");
const catchAsyncError = require("../middleware/catchAsyncError");

/**
 * @description Donate
 * @route POST /v1/donate
 * @access PUBLIC
 */
exports.donateNow = catchAsyncError(async (req, res) => {
  /**
   * @todo Handle validation for req.body
   */

  const donation = await Donate.makeDonation(req.body);
  if (donation.success === true)
    return res.status(201).json({
      status: true,
      message: "Follow this link to complete donation",
      data: donation.data
    });
  else
    return res.status(500).json({
      status: false,
      message: "Unfortunately, something happened"
    });
});

/**
 * @description Flutterwave web hook
 * @route POST /v1/donate/flw-webhook
 */
exports.flw_Webhook = catchAsyncError(async (req, res) => {
  const secretHash = process.env.FLW_SECRET_HASH;
  const signature = req.headers["verif-hash"];
  if (!signature || signature !== secretHash) {
    // This request isn't from Flutterwave; discard
    res.status(401).end();
  }

  const payload = req.body;
  // verify that received payload matches FLW's copy
  const transactionValidityBoolean = await Donate.verifyTransaction(
    payload.data.tx_ref,
    payload.data.amount,
    payload.data.currency
  );
  if (transactionValidityBoolean) {
    // record donation if not already recorded
    const donationExists = await Donate.donationExists(payload.data.id);
    if (!donationExists) {
      await Donate.recordTransaction(payload);
    }
  }

  // return 200 to Flutterwave
  res.status(200).send("Received FLW event");
});
