const router = require("express").Router();
const {
  getReferrals,
  getTopReferrers
} = require("../controller/ReferralController");

router.get("/", getReferrals);
router.get("/top-referrers", getTopReferrers);

module.exports = router;
