const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../model/user');
const config = require('../config/database');
const logger = require('../lib/logger');

module.exports = function (passport) {
  let opts = {};
  //opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;

  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    logger.debug('Auth Token :' + JSON.stringify(jwt_payload));

    User.getUserById(jwt_payload.id,async (err, user) => {
      if (err) {
        logger.error(err)
        return done(err, false);
      }
      if (user) {
        try {
          let isMatch = await User.comparePasswordAsync(jwt_payload.password, user.password)

          if (isMatch) {
            if (jwt_payload.role.role <= 2) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          } else {
            return done(null, false);
          }

        } catch (err) {
          logger.error("Error : " + JSON.stringify(err, null, 2))
          throw err
        }
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  }));

}
