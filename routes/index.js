const express = require("express");
const router = express();
const passport = require("passport");
const authRouter = require("./api/AuthRoute");
// Passport Middleware
router.use(passport.initialize());

// Passport Configuration
require("../config/passport")(passport);

// authentication routes
router.use("/", authRouter);

module.exports = router;
