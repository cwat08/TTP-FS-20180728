import axios from 'axios'

/**
 * ACTION TYPES
 */

const VALID_TICKER = 'VALID_TICKER'

/**
 * INITIAL STATE
 */
const defaultisValid = true

/**
 * ACTION CREATORS
 */
const isValidTicker = boolean => ({type: VALID_TICKER, boolean})

/**
 * THUNK CREATORS
 */
export const checkTicker = ticker => async dispatch => {
  try {
    const res = await axios.get(`/api/validate/${ticker}`)
    const boolean = res.data
    dispatch(isValidTicker(boolean))
  } catch (err) {
    console.error(err.message)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultisValid, action) {
  switch (action.type) {
    case VALID_TICKER:
      return action.boolean
    default:
      return state
  }
}
