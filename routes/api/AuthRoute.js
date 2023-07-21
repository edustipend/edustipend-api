const router = require("express").Router();
const {
  signup,
  accountVerify,
  resetPassword,
  updatePassword,
  login
} = require("../../controller/AuthController");

router.post("/register", signup);
router.post("/verify", accountVerify);
router.post("/reset-password", resetPassword);
router.post("/update-password", updatePassword);
router.post("/login", login);

module.exports = router;
