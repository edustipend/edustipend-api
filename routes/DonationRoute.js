const router = require("express").Router();
const {
  validateFlutterwaveWebhookRequest
} = require("../middleware/verifyFlutterwaveWebhookRequest");
const {
  canRecordManualDonations
} = require("../middleware/canRecordManualDonation");
const {
  makeDonation,
  createManualDonation,
  handleFluttwerwaveRequests,
  getTotalDonationsWithinTimeRange,
  getDonations,
  getTotalDonorsAndAmount
} = require("../controller/DonationController");

router.post("/", makeDonation);
router.post("/manual", canRecordManualDonations, createManualDonation);
router.post(
  "/flw-webhook",
  validateFlutterwaveWebhookRequest,
  handleFluttwerwaveRequests
);
router.get("/range", getTotalDonationsWithinTimeRange);
router.get("/overview", getTotalDonorsAndAmount);
router.get("/timeline", getDonations);

module.exports = router;
