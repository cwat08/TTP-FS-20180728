import axios from 'axios'

/**
 * ACTION TYPES
 */
// const GET_STOCKS = 'GET_STOCKS'
const GET_PORTFOLIO = 'GET_PORTFOLIO'
const ADD_STOCK = 'ADD_STOCK'

/**
 * INITIAL STATE
 */
const defaultPortfolio = []

/**
 * ACTION CREATORS
 */
const getPortfolio = portfolio => ({type: GET_PORTFOLIO, portfolio})

const addStock = newPortfolio => ({type: ADD_STOCK, newPortfolio})

/**
 * THUNK CREATORS
 */
export const fetchPortfolio = id => async dispatch => {
  try {
    const res = await axios.get(`/api/portfolio/${id}`)
    const portfolio = res.data
    dispatch(getPortfolio(portfolio))
  } catch (err) {
    console.error(err.message)
  }
}

export const buyStock = stock => async dispatch => {
  try {
    const res = await axios.post('/api/transactions/buy', {
      ...stock
    })
    dispatch(addStock(res.data))
  } catch (err) {
    console.error(err.message)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultPortfolio, action) {
  switch (action.type) {
    case GET_PORTFOLIO:
      return action.portfolio
    case ADD_STOCK:
      return action.newPortfolio
    default:
      return state
  }
}
