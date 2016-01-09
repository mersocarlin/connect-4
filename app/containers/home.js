import React, { Component } from 'react';
import { connect } from 'react-redux';
import PIXI from 'pixi.js';

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


const WebGLRenderer = PIXI.WebGLRenderer;
const Container = PIXI.Container;
const Sprite = PIXI.Sprite;
const Texture = PIXI.Texture;
const Text = PIXI.Text;
const size = PIECE_SIZE * BOARD_SIZE;
const renderer = new WebGLRenderer(size + BOARD_PADDING, size + BOARD_PADDING);
const stage = new Container();
let animOffset = 0;

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
    const { board, playingNow } = connect4;
    const { isAnimating } = board;

    if (playingNow !== RED_TURN || isAnimating) {
      return;
    }
    this.props.dispatch(playWithRed(col));
  }

  onPieceMouseDown (e) {
    const { connect4 } = this.props;
    const { board } = connect4;
    const { target } = e;
    const { isAnimating, result } = board;
    const { playingNow } = connect4;

    if (result) {
      return;
    }

    if (playingNow !== RED_TURN || isAnimating) {
      return;
    }

    this.props.dispatch(playWithRed(target.col));
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

    /* eslint-disable new-cap  */
    return new Texture.fromImage(img);
  }

  playWithYellow () {
    setTimeout(() => {
      const col = Math.floor((Math.random() * BOARD_SIZE));
      this.props.dispatch(playWithYellow(col));
    }, 500);
  }

  animatePiece () {
    const { connect4 } = this.props;
    const { board, playingNow } = connect4;
    const { animatedPiece, isAnimating } = board;

    if (!isAnimating || animatedPiece === null) {
      return;
    }

    let pieceSprite = stage.getChildByName(animatedPiece.name);
    const texture = this.getTextureByValue(animatedPiece.value);

    if (pieceSprite === null) {
      pieceSprite = new Sprite(texture);
      stage.addChild(pieceSprite);
    } else {
      pieceSprite.texture = texture;
    }

    if (!pieceSprite.movingDirection) {
      pieceSprite.movingDirection = {
        from: animatedPiece.from,
        to: animatedPiece.to,
      };

      animOffset = pieceSprite.movingDirection.from.y;
      pieceSprite.name = animatedPiece.name;
      pieceSprite.x = pieceSprite.movingDirection.from.x;
    }

    if (animOffset > pieceSprite.movingDirection.to.y) {
      delete pieceSprite.movingDirection;
      board.isAnimating = false;

      if (board.gameHasFinished(animatedPiece.value)) {
        this.renderButton(board);
        this.renderPIXIBoard();
        return;
      }

      if (playingNow === YELLOW_TURN && !board.result) {
        this.playWithYellow();
      }
      return;
    }

    pieceSprite.visible = true;
    pieceSprite.y = animOffset;

    animOffset += 10;
  }

  renderButton () {
    const buttonName = `btnNewGame`;

    let text = stage.getChildByName(buttonName);
    if (text !== null) {
      stage.removeChild(text);
    }

    const textStyle = {
      font: '20px Arial',
      fill: 0xffffff,
      align: 'center',
    };

    text = new Text('New Game', textStyle);
    text.x = 20;
    text.y = 20;
    text.visible = true;
    text.interactive = true;
    text.name = buttonName;
    text.click = () => {
      stage.children
        .filter(item =>
          item.name === buttonName ||
          item.name.indexOf('animatedPiece') !== -1)
        .forEach(item => stage.removeChild(item));

      this.props.dispatch(newGame());
    };
    stage.addChild(text);
  }

  renderPIXIBoard () {
    const { connect4 } = this.props;
    const { board } = connect4;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = board.getPieceAt(row, col);
        const pieceValue = piece.value;

        let texture = this.getTextureByValue(pieceValue);
        if (board.isAnimatedPiece(row, col)) {
          texture = this.getTextureByValue(0);
        }

        let pieceSprite = stage.getChildByName(piece.name);
        if (pieceSprite !== null) {
          stage.removeChild(pieceSprite);
        }
        pieceSprite = new Sprite(texture);
        pieceSprite.x = piece.x;
        pieceSprite.y = piece.y;
        pieceSprite.row = row;
        pieceSprite.col = col;
        pieceSprite.name = piece.name;
        pieceSprite.interactive = true;
        pieceSprite.visible = true;
        pieceSprite.mousedown = (e) => {
          this.onPieceMouseDown(e);
        };
        stage.addChild(pieceSprite);
      }
    }
  }

  render () {
    // const { connect4 } = this.props;
    // console.log('props', connect4);
    // console.log(stage, `children: ${stage.children.length}`);
    this.renderPIXIBoard();

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
