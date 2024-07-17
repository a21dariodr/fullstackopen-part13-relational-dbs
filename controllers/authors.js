const { Blog } = require('../models')
const router = require('express').Router()
const { sequelize } = require('../util/db')

router.get('/', async(_req, res) => {
    const authors = await Blog.findAll({
        attributes: [
            'author',
            [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
            [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
        ],
        group: ['author'],
        order: [
            ['likes', 'DESC']
        ]
    })
    console.log('Authors', JSON.stringify(authors))
    res.json(authors)
})

module.exports = router