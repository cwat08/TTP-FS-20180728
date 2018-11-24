import React, {Component} from 'react'
import {fetchPortfolio} from '../store/portfolio'
import {connect} from 'react-redux'
import {timingSafeEqual} from 'crypto'

//make new portfolio table
//stock id & quantity = update each time user buys/sells
class Portfolio extends Component {
  async componentDidMount() {
    await this.props.fetchPortfolio(this.props.user.id)
  }

  render() {
    return (
      <div>
        {this.props.portfolio.map(portfolio => {
          return (
            <h4 key={portfolio.id}>
              {portfolio.stock.ticker} - {portfolio.quantity} - $
            </h4>
          )
        })}
      </div>
    )
  }
}

const mapState = state => ({
  portfolio: state.portfolio,
  user: state.user
})
const mapDispatch = dispatch => {
  return {
    fetchPortfolio: id => dispatch(fetchPortfolio(id))
  }
}

export default connect(mapState, mapDispatch)(Portfolio)
