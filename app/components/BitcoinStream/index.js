/**
*
* BitcoinStream
*
*/

import React from 'react';

import styles from './styles.css';

import Block from 'components/Block';

class BitcoinStream extends React.Component {
  static propTypes = {
    confirmedBlocks: React.PropTypes.array,
    unconfirmedBlock: React.PropTypes.object,
  };

  renderBlock(block) {
    return <Block data={block} key={block.hash} limit={10} />;
  }

  render() {
    return (
      <div className={styles.bitcoinStreamContainer}>
        <h1 className={styles.header}>Bitcoin Blockchain</h1>
        <ul className={styles.bitcoinStream}>
          <Block data={this.props.unconfirmedBlock} key={this.props.unconfirmedBlock.hash} limit={10} />
          {this.props.confirmedBlocks.map(this.renderBlock)}
        </ul>
      </div>
    );
  }
}

export default BitcoinStream;
