/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a neccessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';

import request from 'utils/request';

import BitcoinStream from 'components/BitcoinStream';

/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends React.Component {
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
      confirmedBlocks: [],
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
          this.setState({
            confirmedBlocks: this.blocks,
            unconfirmedBlock: this.emptyUnconfirmedBlock,
          });
        }
      });
  }

  render() {
    return (
      <BitcoinStream confirmedBlocks={this.state.confirmedBlocks} unconfirmedBlock={this.state.unconfirmedBlock} />
    );
  }
}
