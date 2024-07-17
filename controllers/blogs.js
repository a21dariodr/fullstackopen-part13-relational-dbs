const router = require('express').Router()
const { Blog, User, Session } = require('../models')
const { Op } = require('sequelize')
const { blogFinder, tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
    let where = {}
    if (req.query.search) {
        where = {
            [Op.or]: [
                { 
                    title: { 
                        [Op.iLike]: `%${req.query.search}%` 
                    } 
                }, 
                { 
                    author: { 
                        [Op.iLike]: `%${req.query.search}%` 
                    }
                }
            ],
        }
    }

    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name', 'username']
        },
        where,
        order: [
            ['likes', 'DESC']
        ]
    })
    console.log('Blogs', JSON.stringify(blogs))
    res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
    const session = await Session.findOne({
        userId: req.decodedToken.id
    })
    if (!session) {
        const error = new Error('User not logged in')
        error.type = 'UserSessionError'
        next(error)
    }

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

router.put('/:id', blogFinder, async (req, res, next) => {
    if (req.blog) {
        if (req.body.likes) {
            req.blog.likes = req.body.likes;
            await req.blog.save()
            res.json(req.blog)
        } else {
            const error = new Error('Error when updating blog')
            error.type = 'BlogUpdateError'
            next(error)
        }
    } else {
        const error = new Error('Resource not found')
        error.type = 'ResourceNotFound'
        next(error)
    }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res, next) => {
    const session = await Session.findOne({
        userId: req.decodedToken.id
    })
    if (!session) {
        const error = new Error('User not logged in')
        error.type = 'UserSessionError'
        next(error)
    }
    
    try {
        const user = await User.findByPk(req.decodedToken.id)
        if (!user) {
            const error = new Error('User token missing')
            error.type = 'TokenMissing'
            next(error)
        }
        if (req.blog && user.id !== req.blog.userId) {
            const error = new Error('Only the user who created a blog can delete it')
            error.type = 'WrongUser'
            next(error)
        }
        if (req.blog) await req.blog.destroy()
        res.status(204).end()
    } catch(error) {
        error.type = 'BlogDeleteError'
        next(error)
    }
})

module.exports = router