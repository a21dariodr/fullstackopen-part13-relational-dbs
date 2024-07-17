const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn('blogs', 'year', {
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
        })
    },

    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('blogs', 'year')
    }
}