const router = require("express").Router();
const { signup, accountVerify } = require("../../controller/AuthController");

router.post("/register", signup);
router.post("/verify", accountVerify);

module.exports = router;
