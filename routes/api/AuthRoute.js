const router = require("express").Router();
const {
  signup,
  accountVerify,
  resetPassword,
  updatePassword
} = require("../../controller/AuthController");

router.post("/register", signup);
router.post("/verify", accountVerify);
router.post("/reset-password", resetPassword);
router.post("/update-password", updatePassword )

module.exports = router;
