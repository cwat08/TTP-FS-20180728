const router = require('express').Router()
const axios = require('axios')
const {Transaction, Stock, User, Portfolio} = require('../db/models')

module.exports = router
router.get('/:id', async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      where: {userId: req.params.id},
      include: [{model: Stock}]
    })
    res.send(transactions)
  } catch (err) {
    next(err)
  }
})

router.post('/buy', async (req, res, next) => {
  try {
    const ticker = req.body.ticker
    const userId = req.body.userId

    const results = await axios.get(
      `https://api.iextrading.com/1.0/stock/${ticker}/quote`
    )

    const data = results.data
    const currentPrice = data.iexRealtimePrice
    const quantity = req.body.quantity
    const symbol = data.symbol
    const openingPrice = data.open

    const stock = await Stock.findOne({where: {ticker: symbol}})
    const user = await User.findById(userId)

    //create new transaction
    const newTransaction = await Transaction.create({
      shareQuantity: quantity,
      price: currentPrice || openingPrice,
      transactionType: 'buy',
      stockId: stock.id
    })

    await user.addTransaction(newTransaction)
    const portfolio = await Portfolio.findOne({
      where: {
        userId: user.id,
        stockId: stock.id
      }
    })
    //create or update an existing portfolio
    if (!portfolio) {
      const newPortfolio = await Portfolio.create({
        quantity,
        userId: user.id,
        stockId: stock.id
      })
      newPortfolio.setUser(user.id)
      newPortfolio.setStock(stock.id)
    } else {
      const newQuantity = +portfolio.quantity + +quantity
      portfolio.update({quantity: newQuantity})
    }
    //update users account total to reflect stock purchase
    const transactionTotal = quantity * (currentPrice || openingPrice)
    const newAccountTotal = user.accountTotal - transactionTotal
    await user.update({
      accountTotal: newAccountTotal
    })
    const newPortfolio = await Portfolio.findAll({
      where: {userId: userId},
      include: [{model: Stock}]
    })
    res.send(newPortfolio)
  } catch (err) {
    console.log(err.message)
  }
})
