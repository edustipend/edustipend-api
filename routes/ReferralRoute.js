const router = require("express").Router();
const {
  createReferralLink,
  getReferrals,
  getTopReferrersByAmount,
  getTopReferrersByReferralCount
} = require("../controller/ReferralController");

router.get("/", getReferrals);
router.get("/top-referrers-by-amount", getTopReferrersByAmount);
router.get("/top-referrers-by-count", getTopReferrersByReferralCount);
router.post("/link", createReferralLink);

module.exports = router;
