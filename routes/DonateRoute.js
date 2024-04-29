const router = require("express").Router();

const { createTransaction, flw_Webhook } = require("../controller/DonateController");

router.post("/", createTransaction);
router.post("/flw-webhook", flw_Webhook);
// router.get()
// router.post()

module.exports = router;
