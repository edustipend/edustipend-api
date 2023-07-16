const express = require("express");
const router = express();
const passport = require("passport");
const authRouter = require("./api/AuthRoute");
const userRouter = require("./api/UserRoute");

// Passport Middleware
router.use(passport.initialize());

// Passport Configuration
require("../config/passport")(passport);

// authentication routes
router.use("/", authRouter);
router.use("/user", userRouter);

module.exports = router;
