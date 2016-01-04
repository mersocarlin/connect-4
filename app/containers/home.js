import React, { Component } from 'react';
import { connect } from 'react-redux';

import Board from '../components/board';

import { playWithRed, playWithYellow } from '../actions/connect4';
import { RED_TURN, YELLOW_TURN } from '../reducers/connect4';


class Home extends Component {
  onBoardClick (col) {
    const { connect4 } = this.props;

    switch (connect4.playingNow) {
      default:
      case RED_TURN:
        this.props.dispatch(playWithRed(col));
        break;
      case YELLOW_TURN:
        this.props.dispatch(playWithYellow(col));
        break;
    }
  }

  render () {
    const { connect4 } = this.props;

    console.log('props', connect4);

    return (
      <div className="app-page page-home">
        <Board
          board={connect4.board}
          onClick={this.onBoardClick.bind(this)}
        />
      </div>
    );
  }
}

export default connect((state) => {
  return {
    connect4: state.connect4,
  };
})(Home);
