const router = require("express").Router();
const {
  flutterwaveWebhookValidator
} = require("../middleware/FlutterwaveWebhookValidation");

const {
  createTransaction,
  flw_Webhook
} = require("../controller/DonateController");

router.post("/", createTransaction);
router.post("/flw-webhook", flutterwaveWebhookValidator, flw_Webhook);
// router.get()
// router.post()

module.exports = router;
