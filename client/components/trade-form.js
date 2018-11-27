import React, {Component} from 'react'
import {buyStock} from '../store/stock'
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
      quantityError: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.validateQuantity = this.validateQuantity.bind(this)
  }

  async handleChange(evt) {
    await this.setState({[evt.target.name]: evt.target.value})
  }
  // async validateTicker() {
  //   try {
  //   } catch (error) {
  //     console.log(error.message)
  //   }
  // }
  async validateQuantity() {
    const results = await axios.get(
      `https://api.iextrading.com/1.0/stock/${this.state.ticker}/quote`
    )
    if (!Number.isInteger(this.state.quantity)) {
      this.setState({quantityError: 'Quantity must be a whole integer'})
      return false
    } else if (
      //FIX THIS - IT LETS YOU BUY THINGS EVEN IF YOU DONT HAVE MONEY!!!
      results.data.iexRealtimePrice * this.state.quantity >
      this.props.user.accountTotal
    ) {
      this.setState({
        quantityError: 'You do not have enough funds for that transaction'
      })
      return false
    } else return true
  }
  async handleSubmit(evt) {
    evt.preventDefault()
    const validQuant = this.validateQuantity()
    //add validation for ticker too!
    if (validQuant) {
      await this.props.buyStock({
        ticker: this.state.ticker,
        quantity: this.state.quantity,
        userId: this.props.user.id
      })
      await this.props.me()
      this.setState({hasSubmitted: true, stock: this.props.stock})
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
            <input name="ticker" onChange={this.handleChange} />
            <label htmlFor="quantity">Quantity: </label>
            <input name="quantity" onChange={this.handleChange} />
            {this.state.quantityError.length ? (
              <h4>{this.state.quantityError}</h4>
            ) : null}
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
    me: () => dispatch(me())
  }
}

export default connect(mapState, mapDispatch)(TradeForm)
