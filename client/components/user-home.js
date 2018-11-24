import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const UserHome = props => {
  const {name, accountTotal} = props

  return (
    <div>
      <h3>Welcome, {name}!</h3>
      <h5>Current Account Balance: ${accountTotal.toLocaleString('en')}</h5>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    name: state.user.name,
    accountTotal: state.user.accountTotal
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string,
  name: PropTypes.string
}
