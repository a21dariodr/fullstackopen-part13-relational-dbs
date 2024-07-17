const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Blog extends Model {}
Blog.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    year: {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: 1991,
          msg: 'The year should be at least equal to 1991',
        },
        max: {
          args: new Date().getFullYear(),
          msg: 'The year cannot be greater than the current year',
        },
      }
    }
  }, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'blog'
  }
)

module.exports = Blog