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

router.put('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        if (req.body.likes) {
            req.blog.likes = req.body.likes;
            await req.blog.save()
            res.json(req.blog)
        } else {
            res.status(400).send({ error: 'value of important field is required' })
        }
    } else {
        return res.status(404).end()
    }
})

router.delete('/:id', blogFinder, async (req, res) => {
    if (req.blog) await req.blog.destroy()
    res.status(204).end()
})

module.exports = router