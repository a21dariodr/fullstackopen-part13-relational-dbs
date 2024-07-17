const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')

User.hasMany(Blog)
Blog.belongsTo(User)

Blog.belongsToMany(User, { through: ReadingList, as: 'readers' })
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })

module.exports = {
    Blog,
    User,
    ReadingList
}