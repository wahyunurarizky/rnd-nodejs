const User = require('../models').User

exports.findOne = (whereClause, includeField) => {
  return User.findOne({
    where: whereClause,
    attributes: {
      include: includeField,
    },
  })
}

exports.findOneByProperty = (params) => {
  return User.findOne({
    where: params,
  })
}

exports.findAllUser = () => {
  return User.findAll()
}

exports.create = (payload) => {
  return User.create(payload)
}

exports.updateById = (id, payload) => {
  return User.update(payload, {where: {id}});
}
