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
const renderer = new WebGLRenderer(size + BOARD_PADDING, size + BOARD_PADDING + 200);
const stage = new Container();
const TEXT_STYLE = {
  font: '20px Roboto',
  fill: 0xffffff,
  align: 'center',
};
const animOffset = 20;
let animPosition = 0;


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

    if (!board.canPlayAt(target.col)) {
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

  playWithYellow (board) {
    setTimeout(() => {
      const col = Math.floor((Math.random() * BOARD_SIZE));
      if (!board.canPlayAt(col)) {
        this.playWithYellow(board);
        return;
      }

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

      animPosition = pieceSprite.movingDirection.from.y;
      pieceSprite.name = animatedPiece.name;
      pieceSprite.x = pieceSprite.movingDirection.from.x;
    }

    if (animPosition > pieceSprite.movingDirection.to.y) {
      delete pieceSprite.movingDirection;
      board.isAnimating = false;

      if (board.gameHasFinished(animatedPiece.value)) {
        this.renderNewGame(board);
        this.renderPIXIBoard(connect4);
        this.renderScore(connect4);
        return;
      }

      if (playingNow === YELLOW_TURN && !board.result) {
        this.playWithYellow(board);
      }
      return;
    }

    pieceSprite.visible = true;
    pieceSprite.y = animPosition;

    animPosition += animOffset;
  }

  renderHeader () {
    const headerName = `headerElement`;

    let header = stage.getChildByName(headerName);
    if (header !== null) {
      stage.removeChild(header);
    }

    header = new Text('Connect-4', {
      font: 'bold 40px Roboto',
      fill: '#fff',
      align: 'center',
      stroke: '#34495e',
      strokeThickness: 15,
      lineJoin: 'round',
    });

    header.anchor.x = 0.5;
    header.anchor.y = 1;
    header.x = renderer.width / 2;
    header.y = 70;
    header.name = headerName;

    stage.addChild(header);
  }

  renderFooter () {
    const footerName = `footerElement`;

    let footer = stage.getChildByName(footerName);
    if (footer !== null) {
      stage.removeChild(footer);
    }

    const textInstructions = `
      Use your mouse to put red pieces into the board.
      Your goal is to get four of them in a row
      vertically, horizontally or diagonally.


      https://github.com/mersocarlin/connect-4
    `;

    footer = new Text(textInstructions, {
      font: 'italic 18px Roboto',
      fill: '#fff',
      align: 'center',
    });
    footer.anchor.x = 0.5;
    footer.anchor.y = 1;
    footer.x = renderer.width / 2;
    footer.y = size + BOARD_PADDING + 150;
    footer.name = footerName;

    stage.addChild(footer);
  }

  renderScore ({ board, playingNow }) {
    const { result } = board;
    const scoreName = `scoreElement`;

    let score = stage.getChildByName(scoreName);
    if (score !== null) {
      stage.removeChild(score);
    }

    let text;
    if (result) {
      switch (result.type) {
        default:
        case 0:
          text = 'Draw!';
          break;
        case RED_TURN:
          text = 'You Win!';
          break;
        case YELLOW_TURN:
          text = 'You Lose!';
          break;
      }
    } else {
      text = playingNow === RED_TURN ? `It's your turn.` : `Wait for player.`;
    }

    score = new Text(text, TEXT_STYLE);
    score.x = size;
    score.y = size + BOARD_PADDING / 2 + 20;
    score.name = scoreName;

    stage.addChild(score);
  }

  renderNewGame () {
    const buttonName = `btnNewGame`;

    let text = stage.getChildByName(buttonName);
    if (text !== null) {
      stage.removeChild(text);
    }

    text = new Text('New Game', TEXT_STYLE);
    text.x = 20;
    text.y = 20;
    text.visible = true;
    text.name = buttonName;
    text.interactive = true;
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

  renderPIXIBoard ({ board }) {
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
    const { connect4 } = this.props;
    // console.log('props', connect4);
    // console.log(stage, `children: ${stage.children.length}`);
    this.renderHeader();
    this.renderPIXIBoard(connect4);
    this.renderScore(connect4);
    this.renderFooter();

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
