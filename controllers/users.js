const router = require('express').Router()
const { User } = require('../models')

const userFinder = async (req, _res, next) => {
    req.user = await User.findByPk(req.params.id)
    next()
}

router.get('/', async (_req, res) => {
    const users = await User.findAll()
    console.log('Users', JSON.stringify(users))
    res.json(users)
})

router.post('/', async (req, res) => {
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

module.exports = router