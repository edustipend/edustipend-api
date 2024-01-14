const express = require("express");
const router = express();
const passport = require("passport");
const authRouter = require("./AuthRoute");
const adminRouter = require("./AdminRoute");
const stipendApplicationRouter = require("./StipendApplicationRoute");
const userRouter = require("./UserRoute");
const waitlistRouter = require("./JoinWaitlistRoute");
const User = require("../models/UserV2");
const LocalStrategy = require("passport-local").Strategy;

// Passport Middleware Configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.use(passport.initialize());

router.use("/", authRouter);
router.use("/stipend", stipendApplicationRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/waitlist", waitlistRouter);

module.exports = router;
