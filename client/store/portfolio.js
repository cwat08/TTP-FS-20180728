import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
// const GET_STOCKS = 'GET_STOCKS'
const GET_PORTFOLIO = 'GET_PORTFOLIO'

/**
 * INITIAL STATE
 */
const defaultPortfolio = []

/**
 * ACTION CREATORS
 */
const getPortfolio = portfolio => ({type: GET_PORTFOLIO, portfolio})

/**
 * THUNK CREATORS
 */
export const fetchPortfolio = id => async dispatch => {
  try {
    const res = await axios.get(`/api/stock/portfolio/${id}`)
    const portfolio = res.data
    // const withCurrPrice = await portfolio.map(async port => {
    //   const results = await `https://api.iextrading.com/1.0/stock/${
    //     port.stock.ticker
    //   }/quote`
    //   const price = results.data.iexRealtimePrice

    //   return {...port, price}
    // })

    dispatch(getPortfolio(portfolio))
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
    default:
      return state
  }
}
