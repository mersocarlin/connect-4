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
import { BOARD_PADDING, BOARD_SIZE, PIECE_SIZE } from '../domain/board';

import '../scripts/pixi.min.js';

const WebGLRenderer = PIXI.WebGLRenderer;
const Container = PIXI.Container;
const Texture = PIXI.Texture;
const Text = PIXI.Text;
const size = PIECE_SIZE * BOARD_SIZE;
const renderer = new WebGLRenderer(size + BOARD_PADDING, size + BOARD_PADDING);
const stage = new Container();
let test = 0;

class Home extends Component {

  componentWillMount () {
    renderer.backgroundColor = 0x0083cd;

    if (!document.getElementsByTagName('canvas').length) {
      document.body.appendChild(renderer.view);
    }

    const animate = () => {
      this.animatePiece();
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

  renderButton ({ result }) {
    const buttonName = `btnNewGame`;

    if (!result) {
      const child = stage.getChildByName(buttonName);
      if (child !== null) {
        stage.removeChild(child);
      }
      return;
    }

    const textStyle = {
      font: '20px Arial',
      fill: 0xffffff,
      align: 'center',
    };
    const text = new Text('New Game', textStyle);
    text.x = 20;
    text.y = 20;
    text.interactive = true;
    text.name = `btnNewGame`;
    text.click = () => {
      this.props.dispatch(newGame());
    };
    stage.addChild(text);
  }

  animatePiece () {
    const { connect4 } = this.props;
    const { board, playingNow } = connect4;
    const { animatedPiece } = board;

    if (!board.animating) {
      return;
    }

    if (animatedPiece === null) {
      return;
    }

    let pieceSprite = stage.getChildByName(animatedPiece.name);
    if (pieceSprite === null) {
      return;
    }

    if (!pieceSprite.movingDirection) {
      pieceSprite.movingDirection = {
        from: {
          x: animatedPiece.from.x,
          y: animatedPiece.from.y,
        },
        to: {
          x: animatedPiece.to.x,
          y: animatedPiece.to.y,
        }
      };
      console.log('here', pieceSprite.movingDirection)
      test = pieceSprite.movingDirection.from.y;
      pieceSprite.x = pieceSprite.movingDirection.from.x;
      pieceSprite.y = pieceSprite.movingDirection.from.y;

      stage.removeChild(pieceSprite);
      stage.addChild(pieceSprite);
    }

    if (test > pieceSprite.movingDirection.to.y) {
      delete pieceSprite.movingDirection;
      board.animating = false;

      if (playingNow === YELLOW_TURN && !board.result) {
        this.playWithYellow();
      }
      return;
    }

    console.log('animate')
    pieceSprite.x = pieceSprite.movingDirection.from.x;
    pieceSprite.y = test;

    test+=5;
  }

  renderPIXIBoard () {
    const { connect4 } = this.props;
    const { board } = connect4;
    const Sprite = PIXI.Sprite;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = board.getPieceAt(row, col);
        const texture = this.getTextureByValue(board.getValueAt(row, col));
        const pieceSprite = new Sprite(texture);

        pieceSprite.x = piece.x;
        pieceSprite.y = piece.y;
        pieceSprite.row = row;
        pieceSprite.col = col;
        pieceSprite.name = piece.name;
        pieceSprite.interactive = true;
        pieceSprite.mousedown = (e) => {
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

        const child = stage.getChildByName(pieceSprite.name);
        if (child !== null) {
          stage.removeChild(child);
        }
        stage.addChild(pieceSprite);
      }
    }
  }

  render () {
    const { connect4 } = this.props;
    const { board, playingNow } = connect4;

    console.log('props', connect4);

    // if (playingNow === YELLOW_TURN && !board.result) {
    //   this.playWithYellow();
    // }

    this.renderPIXIBoard();
    this.renderButton(board);

    return (
      <div className="app-page page-home">
      </div>
    );
  }
}

export default connect((state) => {
  return {
    connect4: state.connect4,
  };
})(Home);
