/**
*
* Transaction
*
*/

import React from 'react';

import styles from './styles.css';

class Transaction extends React.Component {
  render() {
    return (
      <li className={styles.transaction}>
        {this.props.hash}
      </li>
    );
  }
}

export default Transaction;
