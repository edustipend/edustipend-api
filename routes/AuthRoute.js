const router = require("express").Router();
const passport = require("passport");
const {
  login,
  logout,
  register,
  resetPassword,
  updatePassword
} = require("../controller/AuthController");
const {
  resetPasswordMiddleware,
  updatePasswordMiddleware
} = require("../middleware/resetPasswordMiddleware");
const { isAuthenticated } = require("../middleware/isAuthenticatedMiddleware");

router.post("/login", passport.authenticate("local"), login);
router.post("/logout", isAuthenticated, logout);
router.post("/register", register);
router.post("/reset-password", resetPasswordMiddleware, resetPassword);
router.post("/update-password", updatePasswordMiddleware, updatePassword);

module.exports = router;
