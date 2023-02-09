const multer = require('multer')
const sharp = require('sharp')

const AppError = require('../../utils/appError')

module.exports = function userController(dbRepository, userServices, fsRepository) {
  const index = async (req, res, next) => {
    try {
      const user = await userServices.getAllUser(dbRepository)
      return res.json(user)
    } catch (err) {
      return next(err)
    }
  }

  const show = async (req, res, next) => {
    try {
      const user = await userServices.getOneUser(req.params.id, dbRepository)
      if (!user) {
        return next(new AppError('user not found', 404))
      }
      return res.json(user)
    } catch (err) {
      return next(err)
    }
  }

  const store = async (req, res, next) => {
    try {
      const filteredBody = userServices.filterCreatePayload(req.body)

      // check data
      if ((error = userServices.validateCreateRequest(filteredBody))) {
        return next(new AppError(error.message, 400))
      }

      // Check Email
      const emailAlreadyExist = await userServices.userEmailExist(
        filteredBody.email,
        dbRepository
      )
      if (emailAlreadyExist) {
        return next(new AppError('Email Already Exists', 400))
      }

      // create user
      const user = await userServices.createOneUser(filteredBody, dbRepository)

      return res.status(201).json(user)
    } catch (err) {
      next(err)
    }
  }

  // Multer
  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image')) {
        cb(null, true)
      } else {
        cb(new AppError('Not an image! please upload only images', 400), false)
      }
    },
  })

  const uploadUserPhoto = upload.single('photo')

  const resizeUserPhoto = async (req, res, next) => {
    try {
      if (!req.file) return next()
      console.log(req.file)
      req.file.filename = `user/user-${req.params.user_id}.jpeg`

      const photo = await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
      console.log('photos', photo)
      
      await userServices.uploadPhotoUser(photo, req.file.filename, fsRepository)

      next()
    } catch (err) {
      next(err)
    }
  }

  const updatePhoto = async (req, res, next) => {
    try {
      const user = await userServices.updateUser(
        req.params.user_id,
        { photo: req.file.filename },
        dbRepository
      )
      return res.json(user)
    } catch (err) {
      return next(err)
    }
  }

  return {
    uploadUserPhoto,
    resizeUserPhoto,
    index,
    show,
    store,
    updatePhoto,
  }
}
