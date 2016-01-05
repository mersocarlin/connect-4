import React, { Component } from 'react';
import { connect } from 'react-redux';

import redIMG from '../img/red.png';
import yellowIMG from '../img/yellow.png';
import emptyIMG from '../img/empty.png';

import {
  newGame,
  playWithRed,
  playWithYellow,
} from '../actions/connect4';
import { RED_TURN, YELLOW_TURN } from '../reducers/connect4';
import { BOARD_SIZE, PIECE_SIZE } from '../domain/board';

import '../scripts/pixi.min.js';
const WebGLRenderer = PIXI.WebGLRenderer;
const Container = PIXI.Container;
const size = PIECE_SIZE * BOARD_SIZE;
const renderer = new WebGLRenderer(size, size);
const stage = new Container();


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

  getTextureByValue (type) {
    let img;

    switch (type) {
      default:
      case 0:
        img = emptyIMG;
        break;
      case 1:
        img = redIMG;
        break;
      case 2:
        img = yellowIMG;
        break;
    }

    return new PIXI.Texture.fromImage(img);
  }

  handleNewGameClick () {
    this.props.dispatch(newGame());
  }

  renderPIXIBoard () {
    const { connect4 } = this.props;
    const { board } = connect4;
    const Sprite = PIXI.Sprite;

    for (let row = 0; row < BOARD_SIZE; row++) {
      const rowPos = (BOARD_SIZE - 1) - row;
      for (let col = 0; col < BOARD_SIZE; col++) {
        const texture = this.getTextureByValue(board.getValueAt(row, col));
        const piece = new Sprite(texture);

        piece.x = col * PIECE_SIZE;
        piece.y = rowPos * PIECE_SIZE;
        piece.interactive = true;

        piece.mousedown = (e) => {
          const { target } = e;

          switch (connect4.playingNow) {
            default:
            case RED_TURN:
              this.props.dispatch(playWithRed(target.col));
              break;
            case YELLOW_TURN:
              this.props.dispatch(playWithYellow(target.col));
              break;
          }

          this.renderPIXIBoard();
        };

        piece.row = row;
        piece.col = col;

        // Add the rocket to the stage
        stage.addChild(piece);
      }
    }
  }

  render () {
    const { connect4 } = this.props;

    console.log('props', connect4);

    // return (
    //   <div className="app-page page-home">
    //     <Board
    //       board={connect4.board}
    //       onClick={this.onBoardClick.bind(this)}
    //     />
    //   </div>
    // );

    this.renderPIXIBoard(stage);

    if (!document.getElementsByTagName('canvas').length) {
      document.body.appendChild(renderer.view);
    }

    const animate = () => {
      renderer.render(stage);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return (
      <div className="app-page page-home">
        <a onClick={::this.handleNewGameClick}>New Game</a>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    connect4: state.connect4,
  };
})(Home);
