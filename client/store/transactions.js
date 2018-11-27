import axios from 'axios'

/**
 * ACTION TYPES
 */

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
    const res = await axios.get(`/api/transactions/${id}`)
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
