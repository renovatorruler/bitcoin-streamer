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

  constructor() {
    super();
    this.state = { blocks: [] }
  }

  async componentDidMount() {
    const blocksUrl = "https://bitcoin.toshi.io/api/v0/blocks";

    request(blocksUrl)
      .then(blocks => this.setState({blocks: blocks.data.slice(0, 5)}))
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
