import React, {Component} from 'react'
import {fetchTransactions} from '../store/transactions'
import {connect} from 'react-redux'

class Transactions extends Component {
  constructor() {
    super()
    // this.state = {
    //   transactions: []
    // }
    this.convertDate = this.convertDate.bind(this)
  }

  async componentDidMount() {
    const transactions = await this.props.fetchTransactions(this.props.user.id)
    //await this.setState({transactions})
  }

  convertDate(time) {
    const date = time.slice(0, time.indexOf('T')).split('-')
    const newDate = `${date[1]}/${date[2]}/${date[0]}`
    return newDate
  }

  render() {
    return this.props.transactions && this.props.transactions.length ? (
      <div>
        <h3 className="page-header">Transaction History</h3>
        <hr />
        <table id="transactions-table">
          <tbody>
            <tr className="heading border">
              <td className="td-portfolio">Transaction</td>
              <td className="td-portfolio">Symbol</td>
              <td className="td-portfolio">Quantity</td>
              <td className="td-portfolio">Price</td>
              <td className="td-long">Date</td>
            </tr>
            {this.props.transactions.map(transaction => {
              return (
                <tr className="transaction" key={transaction.id}>
                  <td>{transaction.transactionType.toUpperCase()}</td>
                  <td> {transaction.stock.ticker}</td>
                  <td> {transaction.shareQuantity.toLocaleString('en')}</td>
                  <td>{transaction.price}</td>
                  <td> {this.convertDate(transaction.createdAt)}</td>
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
