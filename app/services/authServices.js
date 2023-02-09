const Joi = require('joi')
const AppError = require('../../utils/appError')

exports.registerUser = async (
  { name, email, password, provider },
  userRepository
) => {
  return userRepository.create({
    name,
    email,
    password,
    provider,
  })
}

exports.userEmailExist = async (email, userRepository) => {
  return userRepository.findOneByProperty({ email })
}

exports.validateLoginRequest = ({ email, password }) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.required(),
  })

  const validate = schema.validate({ email, password })
  return validate.error
}

exports.checkUserLogin = async ({ email, password }, userRepository) => {
  const user = await userRepository.findOne({ email }, ['password'])
  if (!user) {
    return false
  }
  const validPassword = user.validPassword(password, user.password)

  if (!validPassword) {
    return false
  }
  user.password = undefined
  return user
}
