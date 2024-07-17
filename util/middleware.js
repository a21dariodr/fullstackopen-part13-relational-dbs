const { Blog } = require('../models')
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

module.exports = { blogFinder, tokenExtractor }