const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const createError = require("http-errors");
const User = require("../models/user.model");

passport.use(
  new GoogleStrategy(
      {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/auth/loginByGoogle/callback",
          passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
          try {
              let user = await User.findOne({ email: profile.emails[0].value });

              let randomPassword = '';
              if (!user) {
                  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                  for (let i = 0; i < 10; i++) {
                      randomPassword += characters.charAt(Math.floor(Math.random() * characters.length));
                  }

                  user = await new User({
                      username: profile.displayName,
                      email: profile.emails[0].value,
                      password: randomPassword,
                      fullName: profile.displayName,
                      userAvatar: profile.photos[0]?.value || null,
                      status: "inactive",
                  }).save();
              }

              done(null, user);
          } catch (err) {
              done(err, null);
          }
      }
  )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});


const verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization']) {
        return next(createError.Unauthorized)
    }
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1];

    if (!token) {
        throw createError.NotFound("Token is not provided!")
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            return next(createError.Unauthorized(message))
        }
        req.payload = payload;
        next();
    })
};

const authMiddleware = {
    verifyAccessToken,
    passport,
}

module.exports = authMiddleware;
