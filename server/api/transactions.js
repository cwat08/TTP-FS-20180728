const router = require('express').Router()
const axios = require('axios')
const {Transaction, Stock, User} = require('../db/models')

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
    const company = data.companyName
    const openingPrice = data.open
    let stock = await Stock.findOne({where: {ticker: symbol}})
    if (!stock) {
      stock = await Stock.create({ticker: symbol})
    }
    const user = await User.findById(userId)
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
    if (!portfolio) {
      const newPortfolio = await Portfolio.create({
        quantity,
        userId: user.id,
        stockId: stock.id
      })
      // newPortfolio.setUser(user.id)
      // newPortfolio.setStock(stock.id)
    } else {
      const newQuantity = +portfolio.quantity + +quantity
      portfolio.update({quantity: newQuantity})
    }
    const transactionTotal = quantity * (currentPrice || openingPrice)
    const newAccountTotal = user.accountTotal - transactionTotal
    //have to subtract transaction amount from user accountTotal
    const fullTransaction = await Transaction.findById(newTransaction.id, {
      include: [{model: Stock}]
    })
    // console.log('PUPPPPPPPP')
    // console.log(fullTransaction)
    await user.update({
      accountTotal: newAccountTotal
    })
    res.send(fullTransaction)
  } catch (err) {
    console.log(err.message)
  }
})

//post buy
//post sell
