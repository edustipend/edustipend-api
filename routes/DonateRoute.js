const router = require("express").Router();

const { donateNow } = require("../controller/DonateController");

router.post("/", donateNow);
// router.get()
// router.post()

module.exports = router;
