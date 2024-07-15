const router = require('express').Router()
const { Blog, User } = require('../models')
const jwt = require("jsonwebtoken")
const { SECRET } = require('../util/config')

const blogFinder = async (req, _res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      try {
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      } catch{
        return res.status(401).json({ error: 'Token invalid' })
      }
    }  else {
      return res.status(401).json({ error: 'Token missing' })
    }
    next()
  }

router.get('/', async (_req, res) => {
    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name', 'username']
        }
    })
    console.log('Blogs', JSON.stringify(blogs))
    res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.create({ ...req.body, userId: user.id })
        console.log(blog.toJSON())
        res.json(blog)
    } catch(error) {
        error.type = 'BlogCreationError'
        next(error)
    }
})

router.put('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        if (req.body.likes) {
            req.blog.likes = req.body.likes;
            await req.blog.save()
            res.json(req.blog)
        } else {
            const error = new Error('Error when updating blog')
            error.type = 'BlogUpdateError'
            throw error
        }
    } else {
        const error = new Error('Resource not found')
        error.type = 'ResourceNotFound'
        throw error
    }
})

router.delete('/:id', blogFinder, async (req, res) => {
    if (req.blog) await req.blog.destroy()
    res.status(204).end()
})

module.exports = router