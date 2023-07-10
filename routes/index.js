const express = require("express");
const router = express();
const passport = require("passport");
const authRouter = require("./api/AuthRoute");
const password = require('../controller/UserController')
// Passport Middleware
router.use(passport.initialize());

// Passport Configuration
require("../config/passport")(passport);

// authentication routes
router.use("/", authRouter);


//post request to reset password
router.post('/reset-password', password)

module.exports = router;
