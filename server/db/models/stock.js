const Sequelize = require('sequelize')
const db = require('../db')

const Stock = db.define('stock', {
  ticker: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Stock
