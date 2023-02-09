const express = require('express')
const router = express.Router()
const passport = require('passport')

const userController = require('../../app/controllers/userController')
const userServices = require('../../app/services/userServices')
const userRepositoryPostgresSQL = require('../../db/repositories/userRepositoryPostgreSQL')
const permissionMiddleware = require('../../app/middlewares/permissionMiddleware')
const filesystemS3Repository = require('../../filesystems/repositories/filesystemS3Repository')

const controller = userController(
  userRepositoryPostgresSQL,
  userServices,
  filesystemS3Repository
)

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  controller.index
)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  controller.store
)
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  controller.show
)

router.patch(
  '/:user_id/update-photo',
  passport.authenticate('jwt', { session: false }),
  permissionMiddleware.can('manage user'),
  controller.uploadUserPhoto,
  controller.resizeUserPhoto,
  controller.updatePhoto
)

module.exports = router
