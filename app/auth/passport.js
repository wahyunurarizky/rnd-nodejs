const passport = require('passport')
const authController = require('../controllers/authController')
const userRepositoryPostgreSQL = require('../../db/repositories/userRepositoryPostgreSQL')
const authServices = require('../services/authServices')
const AppError = require('../../utils/appError')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../../db/models').User
const GoogleStrategy = require('passport-google-oauth20').Strategy

const cookieExtractor = (req) => {
  let jwt = null

  if (req && req.cookies) {
    jwt = req.cookies['token']
  }

  return jwt
}

const optionJwtStrategy = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    cookieExtractor,
  ]),
  secretOrKey: process.env.JWT_SECRET,
}

passport.use(
  new JwtStrategy(optionJwtStrategy, function (jwt_payload, done) {
    User.findOne({ where: { id: jwt_payload.id } })
      .then((user) => {
        if (user) {
          return done(null, user)
        } else {
          return done(new AppError('user not found on this token', 403), false)
        }
      })
      .catch((err) => {
        done(err, false)
      })
  })
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  done(null, id)
})

const optionGoogleStrategy = {
  clientID:
    '233742835879-18k08tit7pue4f0e7qna1f1tesldl65u.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:4000/api/v1/auth/google/callback',
}

const controller = authController(userRepositoryPostgreSQL, authServices)
passport.use(
  new GoogleStrategy(optionGoogleStrategy, controller.verifyCallbackGoogle)
)
