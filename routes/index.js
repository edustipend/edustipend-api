const express = require("express");
const router = express();
const passport = require("passport");
const authRouter = require("./api/AuthRoute");
const userRouter = require("./api/UserRoute");
const adminRouter = require("./api/AdminRoute");
const waitlistRouter = require("./api/JoinWaitlistRoute");

// Passport Middleware
router.use(passport.initialize());

// Passport Configuration
require("../config/passport")(passport);

// authentication routes
router.use("/", authRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/waitlist", waitlistRouter);

module.exports = router;
