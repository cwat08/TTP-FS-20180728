import React from 'react'

const PortfolioTableRow = props => {
  const {
    color,
    stockTicker,
    percentChange,
    quantity,
    currPrice,
    totalValue
  } = props.portfolioData

  return (
    <tr className="border">
      <td className={`${color} symbol bold`}>{stockTicker}</td>
      <td className={`${color} td-portfolio`}>{`${percentChange.toFixed(
        2
      )}%`}</td>
      <td className={`${color} price bold td-portfolio`}>
        {currPrice.toFixed(2)}
      </td>
      <td className="bold td-long">{quantity}</td>
      <td className={`${color} bold td-long`}>
        {`$${totalValue.toLocaleString('en')}`}
      </td>
    </tr>
  )
}

export default PortfolioTableRow
