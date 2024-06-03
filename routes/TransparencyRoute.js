const router = require("express").Router();
const {
  getDonations,
  getTotalAmount,
  getTotalDonorsAndAmount
} = require("../controller/TransparencyController.js");

router.get("/donors", getDonations);
router.get("/total-amount", getTotalAmount);
router.get("/donations-summary", getTotalDonorsAndAmount);

module.exports = router;
