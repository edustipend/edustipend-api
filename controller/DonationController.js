const { Donation } = require("../services");
const catchAsyncError = require("../middleware/catchAsyncError");

/**
 * @description Donate
 * @route POST /v1/donate
 * @access PUBLIC
 */
exports.makeDonation = catchAsyncError(async (req, res) => {
  /**
   * @todo Handle validation for req.body
   */
  const res = Donation.makeDonation(req.body);

  if (res.success === true) {
    return res.status(201).json({
      status: true,
      message: "Follow this link to complete donation",
      data: res.data
    });
  } else {
    /**
     * @todo add logging functionality
     **/
    return res.status(500).json({
      status: false,
      message: "Unfortunately, something happened"
    });
  }
});

/**
 * @description Flutterwave web hook
 * @route POST /v1/donate/flw-webhook
 */
exports.handleFluttwerwaveRequests = catchAsyncError(async (req, res) => {
  const payload = req.body;

  // verify that received payload matches FLW's copy
  const isVerifiedTransaction = await Transaction.verifyTransaction(
    payload.data.tx_ref,
    payload.data.amount,
    payload.data.currency
  );

  if (isVerifiedTransaction) {
    // record donation if not already recorded
    const donationExists = await Donation.donationExists(payload.data.id);
    if (!donationExists) {
      await Donation.createDonation(payload);
    }
  }

  res.status(200).send("Received FLW event");
});
