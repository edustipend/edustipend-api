const router = require("express").Router();

const { donateNow, flw_Webhook } = require("../controller/DonateController");

router.post("/", donateNow);
router.post("/flw-webhook", flw_Webhook);
// router.get()
// router.post()

module.exports = router;
