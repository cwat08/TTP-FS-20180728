import React, {Component} from 'react'
import {fetchTransactions} from '../store/transactions'
import {connect} from 'react-redux'

class Transactions extends Component {
  constructor() {
    super()
    this.state = {
      transactions: []
    }
  }

  async componentDidMount() {
    const transactions = await this.props.fetchTransactions(this.props.user.id)
    await this.setState({transactions})
    console.log('************')
    console.log(this.state)
  }

  render() {
    return this.props.transactions && this.props.transactions.length ? (
      <div>
        {this.props.transactions.map(transaction => {
          return (
            <h4 key={transaction.id}>
              {' '}
              BUY ({transaction.stock.ticker}) - {transaction.shareQuantity}{' '}
              Shares @ ${transaction.price}
            </h4>
          )
        })}
      </div>
    ) : (
      <h3>You do not have any transactions yet.</h3>
    )
  }
}

const mapState = state => ({
  transactions: state.transactions,
  user: state.user
})

const mapDispatch = dispatch => {
  return {
    fetchTransactions: id => dispatch(fetchTransactions(id))
  }
}

export default connect(mapState, mapDispatch)(Transactions)
