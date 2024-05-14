const router = require("express").Router();
const {
  validateFlutterwaveWebhookRequest
} = require("../middleware/verifyFlutterwaveWebhookRequest");
const {
  makeDonation,
  handleFluttwerwaveRequests
} = require("../controller/DonationController");

router.post("/", makeDonation);
router.post(
  "/flw-webhook",
  validateFlutterwaveWebhookRequest,
  handleFluttwerwaveRequests
);

module.exports = router;
