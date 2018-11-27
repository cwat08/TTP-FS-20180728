import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
// const GET_STOCKS = 'GET_STOCKS'
const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS'
//const ADD_STOCK = 'ADD_STOCK'

/**
 * INITIAL STATE
 */
const defaultTransactions = []

/**
 * ACTION CREATORS
 */
const loadTransactions = transactions => ({
  type: LOAD_TRANSACTIONS,
  transactions
})

//const addStock = stock => ({type: ADD_STOCK, stock})

/**
 * THUNK CREATORS
 */
export const fetchTransactions = id => async dispatch => {
  try {
    const res = await axios.get(`/api/transactions/${id}`)
    dispatch(loadTransactions(res.data))
  } catch (err) {
    console.error(err.message)
  }
}

// export const buyStock = stock => async dispatch => {
//   try {
//     const res = await axios.post('/api/transactions/buy', {
//       ...stock
//     })
//     dispatch(addStock(res.data))
//   } catch (err) {
//     console.error(err.message)
//   }
// }
/**
 * REDUCER
 */
export default function(state = defaultTransactions, action) {
  switch (action.type) {
    case LOAD_TRANSACTIONS:
      return action.transactions

    default:
      return state
  }
}
