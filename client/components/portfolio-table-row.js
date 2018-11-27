import React, {Component} from 'react'
import {fetchPortfolio} from '../store/portfolio'
import {connect} from 'react-redux'
import axios from 'axios'
import TradeForm from './trade-form'

const PortfolioTableRow = props => {
  const {
    color,
    stockTicker,
    company,
    percentChange,
    quantity,
    currPrice,
    totalValue
  } = props.portfolioData
  return (
    <tr className="border">
      <td className={`${color} symbol bold`}>{stockTicker}</td>
      {/* <td className="tickerBox td-portfolio">
        <tr className={`${color} symbol bold`}>{stockTicker}</tr>
        <tr className="companyName">{company}</tr>
      </td> */}
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
