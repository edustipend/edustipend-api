const router = require("express").Router();
const { signup, accountVerify,password} = require("../../controller/AuthController");

router.post("/register", signup);
router.post("/verify", accountVerify);
router.post('/reset-password', password);

module.exports = router;
