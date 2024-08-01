const router = require("express").Router();
const {
  createReferralLink,
  getReferrals,
  getTopReferrers
} = require("../controller/ReferralController");

router.get("/", getReferrals);
router.get("/top-referrers", getTopReferrers);
router.post("/link", createReferralLink);

module.exports = router;
