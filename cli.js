require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    host: new URL(process.env.DATABASE_URL).hostname
})

const main = async () => {
    try {
      await sequelize.authenticate()
      const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
      blogs.map(blog => {
        let info = ''
        info += blog.author ? blog.author + ': ' : ''
        info += '\'' + blog.title + '\', '
        info += blog.likes + ' likes'
        console.log(info)
      }
      )
      sequelize.close()
    } catch (error) {
      console.error('Unable to connect to the database:', error)
    }
  }
  
  main()