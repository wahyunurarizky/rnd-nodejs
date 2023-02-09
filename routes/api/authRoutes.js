const express = require('express')
const passport = require('passport')

const router = express.Router()
const authController = require('../../app/controllers/authController')

const userRepositoryPostgresSQL = require('../../db/repositories/userRepositoryPostgreSQL')
const authServices = require('../../app/services/authServices')
const controller = authController(userRepositoryPostgresSQL, authServices)

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/api/v1/auth/google', session: false}) ,controller.callbackGoogle)
router.post('/register', controller.register)
router.post('/login', controller.login)

module.exports = router
