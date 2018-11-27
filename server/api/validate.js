const router = require('express').Router()
const {Stock} = require('../db/models')

module.exports = router

router.get('/:ticker', async (req, res, next) => {
  try {
    const stock = await Stock.findOne({
      where: {ticker: req.params.ticker.toUpperCase()}
    })
    if (stock === null) {
      res.send('null')
    } else {
      res.send(stock)
    }
  } catch (err) {
    next(err)
  }
})
