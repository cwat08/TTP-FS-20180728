import React, {Component} from 'react'
import {fetchPortfolio} from '../store/portfolio'
import {connect} from 'react-redux'
import axios from 'axios'
import TradeForm from './trade-form'
import PortfolioTable from './portfolio-table'

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
    this.getColor = this.getColor.bind(this)
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

  getColor(change) {
    let color
    if (change > 0) color = 'green'
    else if (change < 0) color = 'red'
    else color = 'gray'
    return color
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
      const price = data.latestPrice
      const company = data.companyName
      const change = data.changePercent
      const quantity = portfolio[i].quantity
      currPrices[portfolio[i].id] = {open, price, company, change}
      portfolioValue += quantity * price
    }
    await this.setState({prices: currPrices, portfolioValue})
  }

  render() {
    return (
      <div>
        <h3 className="page-header">Welcome, {this.props.user.name}</h3>
        <hr />
        <div id="portfolio-page">
          {this.props.portfolio.length ? (
            <PortfolioTable />
          ) : (
            'You do not have any stocks in your portfolio.'
          )}
          <TradeForm />
        </div>
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
