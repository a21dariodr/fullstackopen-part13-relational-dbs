const router = require('express').Router()
const { Session } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, async (req, res, next) => {
    const session = await Session.findOne({
        where: {
            userId: req.decodedToken.id
        }
    })
    if (session) await session.destroy()
    return res.status(204).end()
})

module.exports = router