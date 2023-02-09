'use strict'
const { Model } = require('sequelize')
const bcrypt = require('bcrypt')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    validPassword(password, userPassword) {
      console.log(password, userPassword)
      return bcrypt.compareSync(password, userPassword)
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },
      age: DataTypes.INTEGER,
      photo: DataTypes.STRING,
      password: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      role: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: 'user',
      },
      provider: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    {
      defaultScope: {
        attributes: {
          exclude: ['password'],
        },
      },
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSaltSync(10, 'a')
            user.password = bcrypt.hashSync(user.password, salt)
          }
        },
      },
      sequelize,
      modelName: 'User',
      tableName: 'users',
    }
  )

  return User
}
