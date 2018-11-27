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
        <table id="transactions-table">
          <tbody>
            <tr className="bold border">
              <td id="transaction-title">Transaction History</td>
            </tr>
            {this.props.transactions.map(transaction => {
              return (
                <tr className="transaction" key={transaction.id}>
                  <td>
                    {' '}
                    BUY ({transaction.stock.ticker}) -{' '}
                    {transaction.shareQuantity} Shares @ ${transaction.price}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
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
