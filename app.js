const express = require('express')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport')

const globalErrorHandling = require('./app/controllers/errorController')

// passport
require('./app/auth/passport')

// router
const userRouter = require('./routes/api/userRoutes')
const authRouter = require('./routes/api/authRoutes')
const AppError = require('./utils/appError')

// passport
app.use(passport.initialize())

// cors
app.use(cors())

// static files
app.use(express.static('public'))

// rate limit
app.use(
  '/api',
  rateLimit({
    max: 100, //100 request
    windowMs: 60 * 60 * 1000, //per jam
    message: 'To many request from this IP, please try again in an hour',
  })
)

// body parser
app.use(express.json({ limit: '15kb' }))
app.use(express.urlencoded({ extended: true, limit: '15kb' }))

// cookie parser
app.use(cookieParser())

app.use('/api/v1/users', userRouter)
app.use('/api/v1/auth', authRouter)

app.use('*', (req, res, next) => {
  next(new AppError(`[${req.method}] url not found`, 404))
})

// error handling
app.use(globalErrorHandling)
module.exports = app
