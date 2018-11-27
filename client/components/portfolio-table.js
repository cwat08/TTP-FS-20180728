import React, {Component} from 'react'
import {fetchPortfolio} from '../store/portfolio'
import {connect} from 'react-redux'
import axios from 'axios'
import TradeForm from './trade-form'
import PortfolioTableRow from './portfolio-table-row'

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
    const keys = Object.keys(this.state.prices)
    return (
      <div>
        {keys.length ? (
          <div id="table-component">
            <div className="portfolio-heading">
              <div className="portfolio-title">Portfolio:</div>
              <div className="portfolio-amount">
                ${this.state.portfolioValue.toLocaleString('en')}
              </div>
            </div>
            <div id="portfolio-content">
              <table id="portfolio-table">
                <tbody>
                  <tr className="heading border">
                    <td className="td-portfolio">Symbol</td>
                    <td className="td-portfolio">% Change</td>
                    <td className="td-portfolio">Price</td>
                    <td className="td-long">Owned Shares</td>
                    <td className="td-long">Total Value</td>
                  </tr>
                  {this.props.portfolio.map(portfolio => {
                    const stockData = this.state.prices[portfolio.id]
                    if (stockData) {
                      const currPrice = stockData.price
                      const totalValue = currPrice * portfolio.quantity
                      const company = stockData.company
                      const percentChange = stockData.change * 100
                      const color = this.getColor(percentChange)
                      const stockTicker = portfolio.stock.ticker
                      const quantity = portfolio.quantity
                      const portfolioData = {
                        stockData,
                        currPrice,
                        totalValue,
                        company,
                        percentChange,
                        color,
                        portfolio,
                        stockTicker,
                        quantity
                      }
                      return (
                        <PortfolioTableRow
                          key={portfolio.id}
                          portfolioData={portfolioData}
                        />
                      )
                    }
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <h3 className="loading">Loading...</h3>
        )}
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
