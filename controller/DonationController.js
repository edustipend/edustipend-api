const { Donation, Transaction, Mail, Referral } = require("../services");
const catchAsyncError = require("../middleware/catchAsyncError");
const generateFlutterwaveTxref = require("../utils/txref-generator");
const Logger = require("../config/logger");

/**
 * @description Donate
 * @route POST /v1/donation
 * @access PUBLIC
 */
exports.makeDonation = catchAsyncError(async (req, res) => {
  /**
   * @todo Handle validation for req.body
   */
  const { referrer, campaign, ...donationPayload } = req.body;
  const tx_ref = generateFlutterwaveTxref();

  const donationRes = await Donation.makeDonation({
    ...donationPayload,
    tx_ref
  });
  if (donationRes.status === "success") {
    // Create referral only when FLW transaction is triggered
    await Referral.createReferral({
      ...req.body,
      tx_ref
    });

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
 * @description Donate larger sums of money (NGN 500,001 and upwards)
 * @route POST /v1/donation/bulk-sum
 * @access PUBLIC
 */
exports.createManualDonation = catchAsyncError(async (req, res) => {
  /**
   * @todo Handle validation for req.body
   */
  const { name, email, phone_number, ...referralDetails } = req.body;
  const newReferral = await Referral.createReferral({
    ...referralDetails,
    transactionCompleted: true
  });

  if (!newReferral) {
    return res.status(400).json({
      status: false,
      message: "Could not record donation, possibly duplicate tx_ref"
    });
  }

  const newDonation = await Donation.createManualDonation(req.body);

  if (!newDonation) {
    return res.status(500).json({
      status: false,
      message: "Could not create manual donation entry, please try again."
    });
  }

  Logger.info(
    `Manual donation created with transaction id: ${referralDetails.tx_ref}`
  );
  return res.status(201).json({
    status: true,
    message: "Manual donation created"
  });
});

/**
 * @description Flutterwave web hook
 * @route POST /v1/donation/flw-webhook
 */
exports.handleFluttwerwaveRequests = catchAsyncError(async (req, res) => {
  const payload = req.body;

  const donationExists = await Donation.donationExists(payload.data.id);
  if (!donationExists) {
    await Donation.createDonation(payload);
    await Referral.updateReferral(payload.data.tx_ref);
  }

  try {
    if (
      !payload?.data?.customer?.name ||
      payload?.data?.customer?.name.toLowerCase().trim() !== "anonymous"
    ) {
      Mail.sendThankYouForDonation(
        payload?.data?.customer?.email,
        payload?.data?.amount,
        payload?.data?.name
      );
    }
  } catch (e) {
    // Fail silently
  }
  res.status(200).send("Received FLW event");
});

/**
 * @description get donations made within a time range
 * @route GET /v1/donation/range
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
 * @route GET /v1/donation/overview
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
 * @route GET /v1/donation/timeline
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
