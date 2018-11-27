const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
// router.use('/stock', require('./stock'))
router.use('/transactions', require('./transactions'))
router.use('/portfolio', require('./portfolio'))
router.use('/validate', require('./validate'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
