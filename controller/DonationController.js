const { Donation, Transaction, Mail } = require("../services");
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

  try {
    if (payload.data.customer.name.toLowerCase() !== "anonymous") {
      Mail.sendThankYouForDonation(
        payload.data.customer.email,
        payload.data.amount
      );
    }
  } catch (e) {
    // Fail silently
  }
  res.status(200).send("Received FLW event");
});

/**
 * @description get donations made within a time range
 * @route GET /v1/donate/range
 * @access PUBLIC
 */
exports.getTotalDonationsWithinTimeRange = catchAsyncError(async (req, res) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);

  const totalDonations = await Donation.getTotal(startDate, endDate);

  return res.status(200).json({
    status: true,
    data: totalDonations
  });
});

/**
 * @description get total donation amount and number of donors
 * @route GET /v1/donate/overview
 * @access PUBLIC
 */
exports.getTotalDonorsAndAmount = catchAsyncError(async (req, res) => {
  const totalDonorsAndDonations = await Donation.getTotalDonorsAndAmount();

  return res.status(200).json({
    status: true,
    data: totalDonorsAndDonations
  });
});

/**
 * @description get details of donations in a timeline
 * @route GET /v1/donate/timeline
 * @access PUBLIC
 */
exports.getDonations = catchAsyncError(async (req, res) => {
  const start = req.query.start;
  const limit = parseInt(req.query.limit) || 50;

  const donors = await Donation.getDonations(start, limit);

  return res.status(200).json({
    status: true,
    data: donors
  });
});
