import React, {Component} from 'react'
import {buyStock} from '../store/stock'
import {connect} from 'react-redux'
import {me} from '../store/user'
class TradeForm extends Component {
  constructor() {
    super()
    this.state = {
      ticker: '',
      quantity: 0,
      hasSubmitted: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleChange(evt) {
    await this.setState({[evt.target.name]: evt.target.value})
  }

  async handleSubmit(evt) {
    evt.preventDefault()
    await this.props.buyStock({
      ticker: this.state.ticker,
      quantity: this.state.quantity,
      userId: this.props.user.id
    })
    await this.props.me()
    this.setState({hasSubmitted: true, stock: this.props.stock})
  }
  //add virtual column in transaction for symbol name??
  render() {
    return this.state.hasSubmitted ? (
      <div>
        <h4>
          Congratulations! You just bought {this.props.stock.shareQuantity}{' '}
          shares of {this.state.ticker} @ ${this.state.stock.price}{' '}
        </h4>
      </div>
    ) : (
      <div>
        <h1>Buy some stock!</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="ticker">Ticker Symbol: </label>
          <input name="ticker" onChange={this.handleChange} />
          <label htmlFor="quantity">Quantity: </label>
          <input name="quantity" onChange={this.handleChange} />
          <button type="submit">Submit</button>
        </form>
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
