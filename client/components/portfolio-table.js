import React from 'react'
import PortfolioTableRow from './portfolio-table-row'

const PortfolioTable = props => {
  const keys = Object.keys(props.prices)
  return (
    <div>
      {keys.length ? (
        <div id="table-component">
          <div className="portfolio-heading">
            <div className="portfolio-title">Portfolio:</div>
            <div className="portfolio-amount">
              ${props.portfolioValue.toLocaleString('en')}
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
                {props.portfolio.map(portfolio => {
                  const stockData = props.prices[portfolio.id]
                  if (stockData) {
                    const currPrice = stockData.price
                    const totalValue = currPrice * portfolio.quantity
                    const company = stockData.company
                    const percentChange = stockData.change * 100
                    const color = props.getColor(percentChange)
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

export default PortfolioTable
