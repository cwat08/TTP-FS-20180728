const router = require('express').Router()
const axios = require('axios')
const {Transaction, Stock, User} = require('../db/models')

module.exports = router

router.get('/transactions/:id', async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      where: {userId: req.params.id}
    })
    res.send(transactions)
  } catch (err) {
    next(err)
  }
})

router.get('/:ticker', async (req, res, next) => {
  // const userId = req.user.id
  const ticker = req.params.ticker
  const results = await axios.get(
    `https://api.iextrading.com/1.0/stock/${ticker}/quote`
  )
  const data = results.data
  const log = {
    // userId,
    ticker: req.params.ticker,
    openingPrice: data.open,
    symbol: data.symbol,
    company: data.companyName,
    currentPrice: data.iexRealtimePrice
  }
  console.log(log)
  res.send({
    openingPrice: data.open,
    symbol: data.symbol,
    company: data.companyName,
    currentPrice: data.iexRealtimePrice
  })
})

router.post('/buy', async (req, res, next) => {
  try {
    const ticker = req.body.ticker
    const userId = req.body.userId
    console.log('___________')
    console.log(userId)

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

    const transactionTotal = quantity * (currentPrice || openingPrice)
    const newAccountTotal = user.accountTotal - transactionTotal
    //have to subtract transaction amount from user accountTotal
    console.log('PIE')
    console.log(transactionTotal)

    await user.update({
      accountTotal: newAccountTotal
    })
    res.send(newTransaction)
  } catch (err) {
    console.log(err.message)
  }
})

//openPrice
//curr Price
// iexRealtimePrice

//need a get all stocks
//need a get all transactions - or is that the same??

//post new stock
//do i need a separate table for portfolio of user??
