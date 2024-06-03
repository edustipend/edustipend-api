const { Donation } = require("../services");
const catchAsyncError = require("../middleware/catchAsyncError");

/**
 * @description get total donations
 * @route GET /v1/transparency
 * @access PUBLIC
 */
exports.getTotalAmount = catchAsyncError(async (req, res) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);

  const totalDonations = await Donation.getTotal(startDate, endDate);

  return res.status(200).json({
    status: true,
    data: totalDonations
  });
});

/**
 * @description get total donors and donations
 * @route GET /v1/transparency
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
 * @description get donors and amounts
 * @route GET /v1/transparency
 * @access PUBLIC
 */
exports.getDonations = catchAsyncError(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const donors = await Donation.getDonations(page, limit);

  return res.status(200).json({
    status: true,
    data: donors
  });
});
