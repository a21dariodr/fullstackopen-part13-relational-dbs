const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Session extends Model {}

Session.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        references: { model: 'users', key: 'id' },
    },
    sessionId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'session'
  })

module.exports = Session