import React, { Component, PropTypes } from 'react';


class BoardPiece extends Component {
  onPieceClick () {
    const { col, onClick } = this.props;

    onClick(col);
  }

  render () {
    const { col, row, value } = this.props;
    const className = `board-piece bg-${value}`;

    return (
      <div className={className} onClick={this.onPieceClick.bind(this)}>
        {row}x{col}={value}
      </div>
    );
  }
}

BoardPiece.propTypes = {
  col: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default BoardPiece;
