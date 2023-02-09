const AppError = require('../../utils/appError')
var jwt = require('jsonwebtoken')

module.exports = function authController(userRepository, authServices) {
  // function send token
  const createSendToken = (user, statusCode, res) => {
    // sign token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    // cookie options
    const cookieOptions = {
      expired: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    }
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

    // send cookie
    res.cookie('token', token, cookieOptions)

    // remove user password
    user.password = undefined

    // send response
    res.status(statusCode).json({
      user,
      token,
    })
  }

  const register = async (req, res, next) => {
    try {
      // Check Email
      const emailAlreadyExist = await authServices.userEmailExist(
        req.body.email,
        userRepository
      )
      if (emailAlreadyExist) {
        return next(new AppError('Email Already Exists', 400))
      }

      // registering user
      const registeredUser = await authServices.registerUser(
        req.body,
        userRepository
      )

      // send response with token
      createSendToken(registeredUser, 201, res)
    } catch (err) {
      return next(err)
    }
  }

  const login = async (req, res, next) => {
    try {
      // check data
      if ((error = authServices.validateLoginRequest(req.body))) {
        return next(new AppError(error.message, 400))
      }

      // check user login
      const user = await authServices.checkUserLogin(req.body, userRepository)
      if (!user) {
        return next(new AppError('incorrect email and password', 401))
      }

      // send response with token
      createSendToken(user, 200, res)
    } catch (err) {
      return next(err)
    }
  }

  const verifyCallbackGoogle = async (
    accessToken,
    refreshToken,
    googleProfile,
    cb
  ) => {
    try {
      const { name, email } = googleProfile._json
      console.log(name, email)

      let user = await authServices.userEmailExist(email, userRepository)
      if (!user) {
        user = await authServices.registerUser(
          { name, email, provider: 'google' },
          userRepository
        )
      }
      cb(null, user)
    } catch (err) {
      cb(err, null)
    }
  }

  const callbackGoogle = (req, res, next) => {
    const user = req.user
    createSendToken(user, 200, res)
    res.send('login success')
  }

  return {
    register,
    login,
    callbackGoogle,
    verifyCallbackGoogle,
  }
}
