import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
// const GET_STOCKS = 'GET_STOCKS'
const BUY_STOCK = 'BUY_STOCK'

/**
 * INITIAL STATE
 */
const defaultStocks = []

/**
 * ACTION CREATORS
 */
const buyStocks = stock => ({type: BUY_STOCK, stock})

/**
 * THUNK CREATORS
 */
export const buyStock = stock => async dispatch => {
  try {
    const res = await axios.post('/api/stock/buy', {
      ...stock
    })
    dispatch(buyStocks(res.data))
  } catch (err) {
    console.error(err.message)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultStocks, action) {
  switch (action.type) {
    case BUY_STOCK:
      return action.stock
    default:
      return state
  }
}
