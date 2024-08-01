const catchAsyncError = require("../middleware/catchAsyncError");
const { Referral } = require("../services");

/**
 * @description Create a referral short-form link
 * @route POST v1/referral/link
 * @access PUBLIC
 */
exports.createReferralLink = catchAsyncError(async (req, res) => {
  const { email, name } = req.body;
  const referralLink = await Referral.createReferralLink(email, name);

  return res.status(200).json({
    status: true,
    data: referralLink
  });
});

/**
 * @description fetch all successful referrals
 * @route GET v1/referral
 * @access PUBLIC
 */
exports.getReferrals = catchAsyncError(async (req, res) => {
  const { referrer } = req.query;

  const referrals = await Referral.getReferrals(referrer);

  return res.status(200).json({
    status: true,
    data: referrals
  });
});

/**
 * @description get top n referrers
 * @route GET v1/referral/top-referrers
 * @access PUBLIC
 */
exports.getTopReferrers = catchAsyncError(async (req, res) => {
  const { top } = req.query;

  const topReferrers = await Referral.getTopReferrers(top);

  return res.status(200).json({
    status: true,
    data: topReferrers
  });
});
