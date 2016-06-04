/**
*
* Transaction
*
*/

import React from 'react';

import styles from './styles.css';

class Transaction extends React.Component {
  static propTypes = {
    hash: React.PropTypes.string,
  };

  constructor() {
    super();
    this.setState({
      hash: this.props.hash,
    });
  }

  render() {
    return (
      <li className={styles.transaction}>
        {this.state.hash}
      </li>
    );
  }
}

export default Transaction;
