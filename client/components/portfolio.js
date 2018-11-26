import React, {Component} from 'react'
import {fetchPortfolio} from '../store/portfolio'
import {connect} from 'react-redux'
import axios from 'axios'

//make new portfolio table
//stock id & quantity = update each time user buys/sells
class Portfolio extends Component {
  constructor() {
    super()
    this.state = {
      prices: {},
      portfolioValue: 0
    }
    this.realTimePrices = this.realTimePrices.bind(this)
    this.fetchPrices = this.fetchPrices.bind(this)
  }
  async componentDidMount() {
    await this.props.fetchPortfolio(this.props.user.id)

    this.realTimePrices()
  }
  realTimePrices() {
    setInterval(() => {
      this.fetchPrices()
    }, 1000)
  }
  async fetchPrices() {
    const portfolio = this.props.portfolio
    let currPrices = {}
    let portfolioValue = 0
    for (let i = 0; i < portfolio.length; i++) {
      const ticker = portfolio[i].stock.ticker
      const res = await axios.get(
        `https://api.iextrading.com/1.0/stock/${ticker}/quote`
      )
      const data = res.data
      const open = data.open
      const price = data.iexRealtimePrice
      const quantity = portfolio[i].quantity
      currPrices[portfolio[i].id] = {open, price}
      portfolioValue += quantity * price
    }
    await this.setState({prices: currPrices, portfolioValue})
  }

  render() {
    const keys = Object.keys(this.state.prices)
    return this.props.portfolio.length ? (
      keys.length ? (
        <div>
          <h2>Portfolio: ${this.state.portfolioValue.toLocaleString('en')}</h2>
          {this.props.portfolio.map(portfolio => {
            const currentPrice =
              this.state.prices[portfolio.id].price * portfolio.quantity
            return (
              <h4 key={portfolio.id}>
                {portfolio.stock.ticker} - {portfolio.quantity} - ${currentPrice.toLocaleString(
                  'en'
                )}
              </h4>
            )
          })}
        </div>
      ) : (
        <h3>Loading...</h3>
      )
    ) : (
      <h3>You do not have any stocks in your portfolio</h3>
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
