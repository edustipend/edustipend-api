const { Donation, Transaction } = require("../services");
const catchAsyncError = require("../middleware/catchAsyncError");
const generateFlutterwaveTxref = require("../utils/txref-generator");

/**
 * @description Donate
 * @route POST /v1/donate
 * @access PUBLIC
 */
exports.makeDonation = catchAsyncError(async (req, res) => {
  /**
   * @todo Handle validation for req.body
   */

  const donationRes = await Donation.makeDonation({
    ...req.body,
    tx_ref: generateFlutterwaveTxref()
  });
  if (donationRes.status === "success") {
    return res.status(201).json({
      status: true,
      message: "Follow this link to complete donation",
      data: donationRes.data
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

  const donationExists = await Donation.donationExists(payload.data.id);
  if (!donationExists) {
    await Donation.createDonation(payload);
  }

  res.status(200).send("Received FLW event");
});
