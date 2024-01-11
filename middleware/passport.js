const User = require("../models/UserV2");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const ErrorMessage = require("../constants/error");
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = {
  secretOrKey: process.env.APP_TOKEN_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = function () {
  const strategy = new Strategy(params, function (payload, done) {
    User.findById(payload.id, function (err, user) {
      if (err) {
        return done(new Error(ErrorMessage.USER_NOT_FOUND), null);
        // } else if (payload.expire <= Date.now()) {
        //   return done(new Error(ErrorMessage.TOKEN_EXPIRED), null);
      } else {
        return done(null, user);
      }
    });
  });

  passport.use(strategy);

  return { initialize: function () { return passport.initialize() } };
};