const AppError = require('../../utils/appError')

exports.can = (...permissions) => {
  return (req, res, next) => {
    if (permissions.includes('manage user')) {
      if (!canManageUser(req.user, req.params.user_id))
        return next(new AppError('not allowed', 403))
    }
    next()
  }
}

const canManageUser = (user, user_id) => {
  if (user.role !== 'Admin') {
    return user.id == user_id
  }
  return true
}
