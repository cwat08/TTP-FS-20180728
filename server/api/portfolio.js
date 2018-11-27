const router = require('express').Router()
const {Stock, Portfolio} = require('../db/models')

module.exports = router

router.get('/:id', async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findAll({
      where: {userId: req.params.id},
      include: [{model: Stock}]
    })
    res.send(portfolio)
  } catch (err) {
    next(err)
  }
})
