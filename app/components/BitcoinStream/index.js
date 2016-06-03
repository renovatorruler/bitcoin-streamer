/**
*
* BitcoinStream
*
*/

import React from 'react';

import request from 'utils/request';
import { call } from 'redux-saga/effects';

import styles from './styles.css';

import Block from 'components/Block';

class BitcoinStream extends React.Component {

  static defaultProps = {
    blocksUrl: "https://bitcoin.toshi.io/api/v0/blocks/latest",
    interval: 5000
  }

  constructor() {
    super();
    this.blockList = []
    this.blocks = []
    this.state = {
      confirmedBlocks: this.blocks,
      unconfirmedBlock: {
        hash: "<unconfirmed>",
        transaction_hashes: [],
        transactions_count: 0,
        height: 0
      }
    }
  }

  componentDidMount() {
    setInterval(() => {
      this.loadLatestConfirmedBlocks();
    }, this.props.interval);
    this.loadLatestConfirmedBlocks();

    this.ws = new WebSocket('wss://bitcoin.toshi.io');
    this.ws.onopen = () => {
        this.ws.send('{"subscribe":"transactions"}');
    }
    this.ws.onmessage = (evt) => {
      let tx = JSON.parse(evt.data);
      let unconfirmedBlock = this.state.unconfirmedBlock;
      unconfirmedBlock.transaction_hashes.unshift(tx.data.hash);
      unconfirmedBlock.transactions_count++;
      this.setState({unconfirmedBlock: this.state.unconfirmedBlock});
    };
    this.ws.onerror = (error) => {
      console.error(error);
    }
  }

  loadLatestConfirmedBlocks() {
    request(this.props.blocksUrl)
      .then(blocks => {
        if(!this.blockList[blocks.data.hash]) {
          this.blocks.unshift(blocks.data);
          this.blockList[blocks.data.hash] = blocks.data;
          this.setState({confirmedBlocks: this.blocks})
        }
      })
  }
  
  render() {
    return (
      <div className={ styles.bitcoinStreamContainer }>
        <h1 className={ styles.header }>Bitcoin Blockchain</h1>
        <ul className={ styles.bitcoinStream }>
          <Block data={this.state.unconfirmedBlock} key={this.state.unconfirmedBlock.hash} limit={ 10 } />
          { this.state.confirmedBlocks.map(this.renderBlock) }
        </ul>
      </div>
    );
  }

  renderBlock(block) {
    return <Block data={block} key={block.hash} limit={ 10 }/>;
  }
}

export default BitcoinStream;
