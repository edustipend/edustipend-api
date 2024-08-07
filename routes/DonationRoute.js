const router = require("express").Router();
const {
  validateFlutterwaveWebhookRequest
} = require("../middleware/verifyFlutterwaveWebhookRequest");
const {
  canCreateManualDonation
} = require("../middleware/canCreateManualDonation");
const {
  makeDonation,
  createManualDonation,
  handleFluttwerwaveRequests,
  getTotalDonationsWithinTimeRange,
  getDonations,
  getTotalDonorsAndAmount
} = require("../controller/DonationController");

router.post("/", makeDonation);
router.post("/manual", canCreateManualDonation, createManualDonation);
router.post(
  "/flw-webhook",
  validateFlutterwaveWebhookRequest,
  handleFluttwerwaveRequests
);
router.get("/range", getTotalDonationsWithinTimeRange);
router.get("/overview", getTotalDonorsAndAmount);
router.get("/timeline", getDonations);

module.exports = router;
