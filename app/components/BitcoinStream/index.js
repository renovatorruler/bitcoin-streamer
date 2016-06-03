/**
*
* BitcoinStream
*
*/

import React from 'react';

import request from 'utils/request';
import { call } from 'redux-saga/effects';

import styles from './styles.css';

import WebSocket from 'ws';

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
    this.ws = new WebSocket('wss://bitcoin.toshi.io');
    this.state = { blocks: this.blocks}
  }

  componentDidMount() {
    setInterval(() => {
      this.loadLatestBlock();
    }, this.props.interval);
    this.loadLatestBlock();

    this.ws.on('transactions', function (data, flags) {
        console.log(data, flags);
    });
  }

  loadLatestBlock() {
    request(this.props.blocksUrl)
      .then(blocks => {
        if(!this.blockList[blocks.data.hash]) {
          this.blocks.unshift(blocks.data);
          this.blockList[blocks.data.hash] = blocks.data;
          this.setState({blocks: this.blocks})
        }
      })
  }
  
  render() {
    return (
      <div className={ styles.bitcoinStreamContainer }>
        <h1 className={ styles.header }>Bitcoin Blockchain</h1>
        <ul className={ styles.bitcoinStream }>
          { this.state.blocks.map(this.renderBlock) }
        </ul>
      </div>
    );
  }

  renderBlock(block) {
    return <Block data={block} key={block.hash}/>;
  }
}

export default BitcoinStream;
