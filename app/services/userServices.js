const Joi = require('joi')

const filterObj = (obj, allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

exports.getAllUser = (userRepository) => {
  return userRepository.findAllUser()
}

exports.getOneUser = (id, userRepository) => {
  return userRepository.findOneByProperty({ id })
}

exports.updateUser = async (id, payload, userRepository) => {
  return await userRepository.updateById(id, payload)
}

exports.filterCreatePayload = (payload) => {
  return filterObj(payload, ['name', 'email', 'password', 'role'])
}

exports.validateCreateRequest = (payload) => {
  const schema = Joi.object({
    name: Joi.string().min(4).max(100).required(),
    email: Joi.string().max(100).email().required(),
    password: Joi.string().min(8).max(100).required(),
    role: Joi.string().valid('User', 'Admin'),
  })

  const validate = schema.validate(payload)
  return validate.error
}

exports.createOneUser = async (payload, userRepository) => {
  const user = await userRepository.create(payload)
  user.password = undefined
  return user
}

exports.userEmailExist = async (email, userRepository) => {
  return userRepository.findOneByProperty({ email })
}

exports.uploadPhotoUser = async (photo, filename, fsRepository) => {
  return fsRepository.put(photo, filename)
}