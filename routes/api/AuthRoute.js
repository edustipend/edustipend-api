const router = require("express").Router();
const {
  signup,
  accountVerify,
  login
} = require("../../controller/AuthController");

router.post("/register", signup);
router.post("/verify", accountVerify);
router.post("/login", login);

module.exports = router;
