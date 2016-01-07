import React, { Component } from 'react';
import { connect } from 'react-redux';

import greenIMG from '../img/green.png';
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
const Texture = PIXI.Texture;
const size = PIECE_SIZE * BOARD_SIZE;
const renderer = new WebGLRenderer(size, size);
const stage = new Container();


class Home extends Component {

  componentWillMount () {
    renderer.backgroundColor = 0x0083cd;

    if (!document.getElementsByTagName('canvas').length) {
      document.body.appendChild(renderer.view);
    }

    const animate = () => {
      renderer.render(stage);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  onBoardClick (col) {
    const { connect4 } = this.props;

    if (connect4.playingNow !== RED_TURN) {
      return;
    }

    this.props.dispatch(playWithRed(col));
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
      case 3:
        img = greenIMG;
        break;
    }

    return new Texture.fromImage(img);
  }

  playWithYellow () {
    setTimeout(() => {
      const col = Math.floor((Math.random() * BOARD_SIZE));
      this.props.dispatch(playWithYellow(col));
    }, 500);
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
          if (board.result) {
            return;
          }

          if (connect4.playingNow !== RED_TURN) {
            return;
          }

          const { target } = e;

          this.props.dispatch(playWithRed(target.col));

          this.renderPIXIBoard();
        };

        piece.row = row;
        piece.col = col;

        stage.addChild(piece);
      }
    }
  }

  render () {
    const { connect4 } = this.props;
    const { board, playingNow } = connect4;

    console.log('props', connect4);

    if (playingNow === YELLOW_TURN && !board.result) {
      this.playWithYellow();
    }

    // return (
    //   <div className="app-page page-home">
    //     <Board
    //       board={connect4.board}
    //       onClick={this.onBoardClick.bind(this)}
    //     />
    //   </div>
    // );

    this.renderPIXIBoard();

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
