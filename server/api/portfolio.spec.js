/* eslint-env mocha, chai */

const {expect} = require('chai')
const supertest = require('supertest')
const app = require('../index')
const agent = supertest.agent(app)
const {Portfolio, User, Transaction, Stock, db} = require('../db/models')

describe('Routes', () => {
  beforeEach(async () => {
    await db.sync({force: true})

    const newUser = await User.create({
      name: 'Bella',
      email: 'bella@email.com',
      password: '123'
    })
    const stock1 = await Stock.create({ticker: 'TWTR'})
    const stock2 = await Stock.create({ticker: 'FB'})
    const stock3 = await Stock.create({ticker: 'IBM'})

    const transaction1 = await Transaction.create({
      shareQuantity: 2,
      price: 35.14,
      transactionType: 'buy'
    })

    await transaction1.setStock(stock1.id)

    const transaction2 = await Transaction.create({
      shareQuantity: 1,
      price: 130.3,
      transactionType: 'buy'
    })
    await transaction2.setStock(stock2.id)

    const transaction3 = await Transaction.create({
      shareQuantity: 3,
      price: 120.3,
      transactionType: 'buy'
    })

    transaction3.setStock(stock2.id)
    await newUser.addTransaction(transaction1)
    await newUser.addTransaction(transaction2)
    await newUser.addTransaction(transaction3)

    const portfolio1 = await Portfolio.create({
      quantity: transaction1.quantity
    })

    await portfolio1.setUser(newUser.id)
    await portfolio1.setStock(transaction1.stockId)

    const portfolio2 = await Portfolio.create({
      quantity: transaction2.quantity,
      userId: newUser.id,
      stockId: transaction2.stockId
    })
    await portfolio2.setUser(newUser.id)
    await portfolio2.setStock(transaction2.stockId)

    const portfolio3 = await Portfolio.findOne({
      where: {
        userId: newUser.id,
        stockId: stock2.id
      }
    })
    const newQuantity = +portfolio3.shareQuantity + +transaction3.shareQuantity
    await portfolio3.update({shareQuantity: newQuantity})
  })

  describe('/transactions', () => {
    describe('GET /transactions', () => {
      it('sends a users transactions for user with id 1', () => {
        return agent
          .get(`/api/transactions/1`)
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an('array')
            expect(res.body.length).to.equal(3)
          })
      })
    })
  })
  describe('GET /portfolio', () => {
    it('sends a users transactions for user with id 1', () => {
      return agent
        .get(`/api/portfolio/1`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('array')
          expect(res.body.length).to.equal(2)
        })
    })
  })
  describe('POST /transactions/buy', () => {
    it('user can buy stock', async () => {
      await agent
        .post(`/api/transactions/buy`)
        .send({ticker: 'IBM', quantity: 1, userId: 1})
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('array')
          expect(res.body.length).to.equal(3)
        })
      const portfolios = await Portfolio.findAll({
        where: {userId: 1}
      })
      const transactions = await Transaction.findAll({where: {userId: 1}})
      expect(portfolios.length).to.equal(3)
      expect(transactions.length).to.equal(4)
    })
  })
  describe('GET /validate', () => {
    it('if valid ticker, it sends back stock object', () => {
      return agent
        .get(`/api/validate/fb`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object')
          expect(res.body.ticker).to.equal('FB')
        })
    })
    it('if ticker is not valid, it sends empty object', () => {
      return agent
        .get(`/api/validate/fbb`)
        .expect(200)
        .then(res => {
          expect(res.body).to.not.have.ownProperty('id')
        })
    })
  })
})
