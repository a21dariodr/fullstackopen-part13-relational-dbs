const router = require('express').Router()
const { ReadingList, User, Blog, Session } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res, next) => {
    try {
        const readingList = await ReadingList.create(req.body)
        console.log(readingList.toJSON())
        res.json(readingList)
    } catch(error) {
        next(error)
    }
    
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
    if (!req.decodedToken) res.status(404).end()

    const session = await Session.findOne({
        userId: req.decodedToken.id
    })
    if (!session) {
        const error = new Error('User not logged in')
        error.type = 'UserSessionError'
        next(error)
    }
    
    if (!('read' in req.body)) res.status(400).end()
    
    const user = await User.findByPk(req.decodedToken.id, {
        attributes: ['id', 'name', 'username'],
        include: {
            model: Blog,
            as: 'readings',
            attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
            through: {
                attributes: ['read', 'id']
            }
        }
    })
    if (!user) res.status(404).end()

    if (!user.readings.map(r => r.id).includes(Number(req.params.id))) {
        const error = new Error('The blog is not in the user\'s reading list')
        error.type = 'ReadStatusUpdateError'
        next(error)
    }

    try {
        const readingList = user.readings.find(r => r.id === Number(req.params.id)).readingList
        readingList.read = req.body.read
        await readingList.save()
        res.json(user)
    } catch(error) {
        next(error)
    }
    
})

module.exports = router