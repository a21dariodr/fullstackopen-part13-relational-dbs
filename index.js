const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const express = require('express')

const app = express()

const errorHandler = (error, _request, response, next) => {
  console.error(error.message)

  if (error.type === 'BlogCreationError'
    || error.type === 'BlogUpdateError'
    || error.type === 'UserCreationError'
    || error.type === 'UserUpdateError'
  ) {
    return response.status(400).json({ error })
  }

  if (error.type === 'ResourceNotFound') {
    return response.status(404).json({ error })
  }

  next(error)
}

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
}

start()