/**
*
* Block
*
*/

import React from 'react';

import request from 'utils/request';
import { call } from 'redux-saga/effects';

import styles from './styles.css';

class Block extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li className={ styles.block }>
        <h2 className={ styles.blockHash }>Block hash: {this.props.data.hash}</h2>
        <ul className={ styles.blockDetails }>
          <li><h3>Transactions</h3></li>
          {this.props.data.transaction_hashes.slice(0,10).map(this.renderTx)}
          <li className={ styles.blockTruncatedEllipses }>&#8230;</li>
          <li className={ styles.blockTruncatedEllipses }>&#8230;</li>
          <li className={ styles.blockTruncatedMsg }>{this.props.data.transactions_count - 10} More Tx</li>
        </ul>
        <footer className={ styles.footer }>Block: {this.props.data.height}</footer>
      </li>
    );
  }

  renderTx(tx) {
    return (
      <li className={ styles.txHash }>{tx}</li>
    );
  }
}

export default Block;
