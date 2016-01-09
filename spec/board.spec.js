import { assert } from 'chai';

import { RED_TURN, YELLOW_TURN } from '../app/reducers/connect4';
import Board, { BOARD_SIZE } from '../app/domain/board';


describe('Board', () => {
  const board = new Board();

  describe('initiate', () => {
    it('should initiate board game', () => {
      board.initiate();
      assert.equal(Object.keys(board.pieces).length, BOARD_SIZE * BOARD_SIZE);
    })
  });

  describe('playAtColWithValue', () => {
    it(`should have ${RED_TURN} after playing at column 0`, () => {
      board.initiate();
      board.playAtColWithValue(0, RED_TURN);

      assert.equal(board.getPieceAt(0, 0).value, RED_TURN);
    });
  });

  describe('animatedPiece', () => {
    it(`should have animatedPiece with row = 0,  col = 0 and value = ${RED_TURN}`, () => {
      board.initiate();
      board.playAtColWithValue(0, RED_TURN);

      const { animatedPiece } = board;
      assert.equal(animatedPiece.row, 0);
      assert.equal(animatedPiece.col, 0);
      assert.equal(animatedPiece.value, RED_TURN);
    });

    it('should return true as animated piece for row = 0 and col = 0', () => {
      assert.equal(board.isAnimatedPiece(0, 0), true);
    });

    it('should return false as animated piece for row = 0 and col = 1', () => {
      assert.equal(board.isAnimatedPiece(0, 1), false);
    });
  });

  describe('gameHasFinished', () => {
    it('should have game finished', () => {
      board.initiate();
      board.playAtColWithValue(0, RED_TURN);
      board.playAtColWithValue(0, YELLOW_TURN);
      board.playAtColWithValue(1, RED_TURN);
      board.playAtColWithValue(1, YELLOW_TURN);
      board.playAtColWithValue(2, RED_TURN);
      board.playAtColWithValue(2, YELLOW_TURN);
      board.playAtColWithValue(3, RED_TURN);

      assert.equal(board.gameHasFinished(RED_TURN), true);
    });

    it('should finish game horizontally', () => {
      board.initiate();
      board.playAtColWithValue(0, RED_TURN);
      board.playAtColWithValue(0, YELLOW_TURN);
      board.playAtColWithValue(1, RED_TURN);
      board.playAtColWithValue(1, YELLOW_TURN);
      board.playAtColWithValue(2, RED_TURN);
      board.playAtColWithValue(2, YELLOW_TURN);
      board.playAtColWithValue(3, RED_TURN);

      assert.equal(board.gameHasFinishedHorizontally(0, 0, RED_TURN) != null, true);
    });

    it('should finish game vertically', () => {
      board.initiate();
      board.playAtColWithValue(0, RED_TURN);
      board.playAtColWithValue(1, YELLOW_TURN);
      board.playAtColWithValue(0, RED_TURN);
      board.playAtColWithValue(1, YELLOW_TURN);
      board.playAtColWithValue(0, RED_TURN);
      board.playAtColWithValue(1, YELLOW_TURN);
      board.playAtColWithValue(0, RED_TURN);

      assert.equal(board.gameHasFinishedVertically(0, 0, RED_TURN) != null, true);
    });

    it('should finish game gameHasFinishedDiagonallyAsc', () => {
      board.initiate();
      board.playAtColWithValue(0, RED_TURN);
      board.playAtColWithValue(1, YELLOW_TURN);
      board.playAtColWithValue(1, RED_TURN);
      board.playAtColWithValue(2, YELLOW_TURN);
      board.playAtColWithValue(2, RED_TURN);
      board.playAtColWithValue(3, YELLOW_TURN);
      board.playAtColWithValue(2, RED_TURN);
      board.playAtColWithValue(3, YELLOW_TURN);
      board.playAtColWithValue(3, RED_TURN);
      board.playAtColWithValue(4, YELLOW_TURN);
      board.playAtColWithValue(3, RED_TURN);
      assert.equal(board.gameHasFinishedDiagonallyAsc(0, 0, RED_TURN) != null, true);
    });

    it('should finish game gameHasFinishedDiagonallyDesc', () => {
      board.initiate();
      board.playAtColWithValue(6, RED_TURN);
      board.playAtColWithValue(5, YELLOW_TURN);
      board.playAtColWithValue(5, RED_TURN);
      board.playAtColWithValue(4, YELLOW_TURN);
      board.playAtColWithValue(4, RED_TURN);
      board.playAtColWithValue(3, YELLOW_TURN);
      board.playAtColWithValue(4, RED_TURN);
      board.playAtColWithValue(3, YELLOW_TURN);
      board.playAtColWithValue(3, RED_TURN);
      board.playAtColWithValue(2, YELLOW_TURN);
      board.playAtColWithValue(3, RED_TURN);
      assert.equal(board.gameHasFinishedDiagonallyDesc(0, 6, RED_TURN) != null, true);
    });
  });
});
