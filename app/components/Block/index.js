/**
*
* Block
*
*/

import React from 'react';

import styles from './styles.css';

class Block extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={ styles.block }>
      Hello
      </div>
    );
  }
}

export default Block;
