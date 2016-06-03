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
          {this.props.data.transaction_hashes.slice(0,10).map(this.renderTx)}
        </ul>
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
