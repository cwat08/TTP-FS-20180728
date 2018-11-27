import React, {Component} from 'react'
import {buyStock} from '../store/transactions'
import {checkTicker} from '../store/validate'
import {connect} from 'react-redux'
import {me} from '../store/user'
import axios from 'axios'
class TradeForm extends Component {
  constructor() {
    super()
    this.state = {
      ticker: '',
      quantity: 0,
      hasSubmitted: false,
      quantityError: '',
      tickerError: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.validateQuantity = this.validateQuantity.bind(this)
    this.validateTicker = this.validateTicker.bind(this)
  }

  async handleChange(evt) {
    await this.setState({[evt.target.name]: evt.target.value})
  }

  async validateQuantity() {
    if (!Number.isInteger(+this.state.quantity)) {
      this.setState({quantityError: 'Quantity must be a whole integer'})
      return false
    } else {
      const results = await axios.get(
        `https://api.iextrading.com/1.0/stock/${this.state.ticker}/quote`
      )
      const latestPrice = results.data.latestPrice
      const quantity = this.state.quantity
      const userAccountTotal = +this.props.user.accountTotal

      if (latestPrice * quantity > userAccountTotal) {
        this.setState({
          quantityError: 'You do not have enough funds for that transaction'
        })
        return false
      }
    }
    return true
  }

  async validateTicker() {
    try {
      const results = await axios.get(`/api/validate/${this.state.ticker}`)
      if (results.data === null) {
        await this.setState({tickerError: 'Please enter a valid ticker symbol'})
        return false
      } else {
        return true
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  async handleSubmit(evt) {
    evt.preventDefault()
    this.setState({quantityError: '', tickerError: ''})
    const validTicker = await this.validateTicker()
    if (validTicker === false) {
      return false
    } else {
      const validQuant = await this.validateQuantity()
      if (validQuant === true) {
        await this.props.buyStock({
          ticker: this.state.ticker,
          quantity: this.state.quantity,
          userId: this.props.user.id
        })
        await this.props.me()
        this.setState({hasSubmitted: true, stock: this.props.stock})
      }
    }
  }
  render() {
    return this.state.hasSubmitted ? (
      <div>
        <h4>
          Congratulations! You just bought {this.props.stock.shareQuantity}{' '}
          shares of {this.state.ticker} @ ${this.state.stock.price}{' '}
        </h4>
      </div>
    ) : (
      <div id="trade-form">
        <div id="trade-form-toggle">
          <div className="toggle active-toggle">BUY</div>
          <div className="toggle notActive">SELL</div>
        </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="ticker">Symbol: </label>
            <input name="ticker" onChange={this.handleChange} />{' '}
            {this.state.tickerError.length ? (
              <h4>{this.state.tickerError}</h4>
            ) : null}
            <label htmlFor="quantity">Quantity: </label>
            <input name="quantity" onChange={this.handleChange} />
            {this.state.quantityError.length ? (
              <h4>{this.state.quantityError}</h4>
            ) : null}
            <div id="stock-preview">
              {/* add logic to only show preview on key up when both field are filled out AND valid*/}
              <div className="portfolio-title  purchase-preview">
                3 shares of FB @ 31.34:{' '}
              </div>
              <div className="portfolio-amount purchase-preview">$$$$$$$$</div>
            </div>
            <button type="submit">Buy</button>
          </form>
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  stock: state.stock,
  user: state.user
})
const mapDispatch = dispatch => {
  return {
    buyStock: stock => dispatch(buyStock(stock)),
    me: () => dispatch(me()),
    checkTicker: ticker => dispatch(checkTicker(ticker))
  }
}

export default connect(mapState, mapDispatch)(TradeForm)
