const router = require('express').Router()
const { User, Blog } = require('../models')

const userFinder = async (req, _res, next) => {
    req.user = await User.findByPk(req.params.id)
    next()
}

router.get('/', async (_req, res) => {
    const users = await User.findAll({
        include: {
          model: Blog,
          attributes: { exclude: ['userId'] }
        }
    })
    console.log('Users', JSON.stringify(users))
    res.json(users)
})

router.post('/', async (req, res, next) => {
    try {
        const user = await User.create(req.body)
        console.log(user.toJSON())
        res.json(user)
    } catch(error) {
        error.type = 'UserCreationError'
        next(error)
    }
})

router.put('/:username', async (req, res) => {
    const user = await User.findOne({
        where: {
            username: req.params.username
        }
    })

    if (user) {
        if (req.body.username) {
            user.username = req.body.username;
            await user.save()
            res.json(user)
        } else {
            const error = new Error('Error when updating username')
            error.type = 'UserUpdateError'
            throw error
        }
    } else {
        const error = new Error('Resource not found')
        error.type = 'ResourceNotFound'
        throw error
    }
})

router.get('/:id', userFinder, async (req, res) => {
    if (!req.user) res.status(404).end()

    const where = {}
    if (req.query.read) {
        where.read = req.query.read
    }

    const user = await User.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['name', 'username'],
        include: {
            model: Blog,
            as: 'readings',
            attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
            through: {
                attributes: ['read', 'id'],
                where
            }
        }
    })

    console.log('User', user.toJSON())
    res.json(user)
})

module.exports = router