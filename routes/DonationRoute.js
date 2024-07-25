const router = require("express").Router();
const {
  validateFlutterwaveWebhookRequest
} = require("../middleware/verifyFlutterwaveWebhookRequest");
const {
  canRecordBulkDonations
} = require("../middleware/canRecordBulkDonation");
const {
  makeDonation,
  recordBulkDonation,
  handleFluttwerwaveRequests,
  getTotalDonationsWithinTimeRange,
  getDonations,
  getTotalDonorsAndAmount
} = require("../controller/DonationController");

router.post("/", makeDonation);
router.post("/bulk-sum", canRecordBulkDonations, recordBulkDonation);
router.post(
  "/flw-webhook",
  validateFlutterwaveWebhookRequest,
  handleFluttwerwaveRequests
);
router.get("/range", getTotalDonationsWithinTimeRange);
router.get("/overview", getTotalDonorsAndAmount);
router.get("/timeline", getDonations);

module.exports = router;
