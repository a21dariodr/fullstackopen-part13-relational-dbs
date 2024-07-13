const router = require('express').Router()
const { Blog } = require('../models')

const blogFinder = async (req, _res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
  }

router.get('/', async (_req, res) => {
    const blogs = await Blog.findAll()
    console.log('Blogs', JSON.stringify(blogs))
    res.json(blogs)
})

router.post('/', async (req, res) => {
    try {
        const blog = await Blog.create(req.body)
        console.log(blog.toJSON())
        res.json(blog)
    } catch(error) {
        return res.status(400).json({ error })
    }
})

router.delete('/:id', blogFinder, async (req, res) => {
    if (req.blog) await req.blog.destroy()
    res.status(204).end()
})

module.exports = router