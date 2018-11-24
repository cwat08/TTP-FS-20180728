import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
// const GET_STOCKS = 'GET_STOCKS'
const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS'

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

/**
 * THUNK CREATORS
 */
export const fetchTransactions = id => async dispatch => {
  try {
    const res = await axios.get(`/api/stock/transactions/${id}`)
    dispatch(loadTransactions(res.data))
  } catch (err) {
    console.error(err.message)
  }
}

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
