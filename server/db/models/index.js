const User = require('./user')
const Transaction = require('./transaction')
const Stock = require('./stock')
const Portfolio = require('./portfolio')
const db = require('../db')

/* Associations */

User.hasMany(Transaction)
Transaction.belongsTo(User)

Stock.hasMany(Transaction)
Transaction.belongsTo(Stock)

User.hasMany(Portfolio)
Portfolio.belongsTo(User)

Stock.hasMany(Portfolio)
Portfolio.belongsTo(Stock)

module.exports = {
  User,
  Transaction,
  Stock,
  Portfolio,
  db
}
