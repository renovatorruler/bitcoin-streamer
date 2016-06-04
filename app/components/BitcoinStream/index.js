/**
*
* BitcoinStream
*
*/

import React from 'react';

import request from 'utils/request';

import styles from './styles.css';

import Block from 'components/Block';

class BitcoinStream extends React.Component {

  static propTypes = {
    blocksUrl: React.PropTypes.string,
    interval: React.PropTypes.number,
  };

  static defaultProps = {
    blocksUrl: 'https://bitcoin.toshi.io/api/v0/blocks/latest',
    interval: 5000,
  };

  constructor() {
    super();
    this.blockList = [];
    this.blocks = [];
    this.emptyUnconfirmedBlock = {
      hash: '<unconfirmed>',
      transaction_hashes: [],
      transactions_count: 0,
      height: 0,
    };
    this.state = {
      confirmedBlocks: this.blocks,
      unconfirmedBlock: this.emptyUnconfirmedBlock,
    };
  }

  componentDidMount() {
    this.loadLatestConfirmedBlocks();

    this.ws = new WebSocket('wss://bitcoin.toshi.io');
    this.ws.onopen = () => {
      this.ws.send('{"subscribe": "transactions"}');
      this.ws.send('{"subscribe": "blocks"}');
    };

    this.ws.onmessage = (evt) => {
      const dataObject = JSON.parse(evt.data);
      if (dataObject.subscription === 'transactions') {
        const unconfirmedBlock = this.state.unconfirmedBlock;
        unconfirmedBlock.transaction_hashes.unshift(dataObject.data.hash);
        unconfirmedBlock.transactions_count++;
        this.setState({ unconfirmedBlock });
      } else if (dataObject.subscription === 'blocks') {
        const confirmedBlocks = this.state.confirmedBlocks;
        confirmedBlocks.unshift(dataObject.data);
        this.setState({
          confirmedBlocks,
          unconfirmedBlock: this.emptyUnconfirmedBlock,
        });
      }
    };

    this.ws.onerror = (error) => {
      console.error(error);
    };
  }

  loadLatestConfirmedBlocks() {
    request(this.props.blocksUrl)
      .then(blocks => {
        if (!this.blockList[blocks.data.hash]) {
          this.blocks.unshift(blocks.data);
          this.blockList[blocks.data.hash] = blocks.data;
          this.setState({ confirmedBlocks: this.blocks });
        }
      });
  }

  renderBlock(block) {
    return <Block data={block} key={block.hash} limit={10} />;
  }

  render() {
    return (
      <div className={styles.bitcoinStreamContainer}>
        <h1 className={styles.header}>Bitcoin Blockchain</h1>
        <ul className={styles.bitcoinStream}>
          <Block data={this.state.unconfirmedBlock} key={this.state.unconfirmedBlock.hash} limit={10} />
          {this.state.confirmedBlocks.map(this.renderBlock)}
        </ul>
      </div>
    );
  }
}

export default BitcoinStream;
