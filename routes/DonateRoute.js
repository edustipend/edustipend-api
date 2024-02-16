const router = require("express").Router();

const { 
  donateNow,
  paystackWebhook
} = require("../controller/DonateController");

router.post("/", donateNow);
router.post("/paystack-webhook", paystackWebhook)
// router.get()
// router.post()

module.exports = router;
