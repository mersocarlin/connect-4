import React, { Component, PropTypes } from 'react';

import BoardPiece from './board-piece';

import { BOARD_SIZE } from '../domain/board';

class Board extends Component {

  componentDidMount () {

  }

  onColumnClick (col) {
    const { onClick } = this.props;

    onClick(col);
  }

  renderPieces () {
    const { board } = this.props;
    const pieces = [];

    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        pieces.push({
          row,
          col,
          value: board.getValueAt(row, col),
        });
      }
    }

    return pieces.map((piece, index) => {
      return (
        <BoardPiece
          key={index}
          row={piece.row}
          col={piece.col}
          value={piece.value}
          onClick={this.onColumnClick.bind(this)}
        />
      );
    });
  }

  render () {
    return (
      <div className="board">
        {this.renderPieces()}
      </div>
    );
  }
}

Board.propTypes = {
  board: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Board;
