const Sequelize = require('sequelize')
const db = require('../db')

const Transaction = db.define('transaction', {
  shareQuantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  transactionType: {
    type: Sequelize.ENUM('buy', 'sell'),
    allowNull: false
  }
})

module.exports = Transaction
