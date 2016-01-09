
export const BOARD_PADDING = 150;
export const BOARD_SIZE = 7;
export const FINISH_SIZE = 4;
export const PIECE_SIZE = 80;

export default class Board {
  constructor () {
    this.initiate();
  }

  getRelativePosition (val) {
    return BOARD_PADDING / 2 + val * PIECE_SIZE;
  }

  initiate () {
    this.pieces = { };
    this.result = null;
    this.animatedPiece = null;
    this.isAnimating = false;

    for (let row = 0; row < BOARD_SIZE; row++) {
      const rowPos = (BOARD_SIZE - 1) - row;
      for (let col = 0; col < BOARD_SIZE; col++) {
        const pos = `${row}${col}`;

        this.pieces[pos] = {
          name: `piece${pos}`,
          row,
          col,
          x: this.getRelativePosition(col),
          y: this.getRelativePosition(rowPos),
          value: 0,
        };
      }
    }
  }

  getValueAt (row, col) {
    if (this.isInResult(row, col)) {
      return 3;
    }

    return this.pieces[`${row}${col}`].value;
  }

  getPieceAt (row, col) {
    return this.pieces[`${row}${col}`];
  }

  isInResult (row, col) {
    if (!this.result) {
      return false;
    }

    return this.result.find(obj => obj.row === row && obj.col === col);
  }

  playAtColWithValue (col, value) {
    this.isAnimating = true;

    for (let row = 0; row < BOARD_SIZE; row++) {
      const pos = `${row}${col}`;

      if (this.pieces[pos].value !== 0) {
        continue;
      }

      this.pieces[pos].value = value;

      this.animatedPiece = {
        row,
        col,
        name: `animatedPiece${pos}`,
        value,
        from: {
          row: 0,
          col,
          x: this.getRelativePosition(col),
          y: this.getRelativePosition(0),
        },
        to: {
          row,
          col,
          x: this.getRelativePosition(col),
          y: this.getRelativePosition(BOARD_SIZE - 1 - row),
        },
      };
      break;
    }

    this.checkResult(value);
  }

  isAnimatedPiece (row, col) {
    return this.isAnimating &&
      this.animatedPiece.row === row &&
      this.animatedPiece.col === col;
  }

  gameHasFinishedHorizontally (x, y, value) {
    const result = [];

    for (let col = y; col < BOARD_SIZE; col++) {
      const pos = `${x}${col}`;

      if (this.pieces[pos].value !== value) {
        return null;
      }

      result.push({
        row: x,
        col,
      });

      if (result.length === FINISH_SIZE) {
        return result;
      }
    }

    return null;
  }

  gameHasFinishedVertically (x, y, value) {
    const result = [];

    for (let row = x; row < BOARD_SIZE; row++) {
      const pos = `${row}${y}`;

      if (this.pieces[pos].value !== value) {
        return null;
      }

      result.push({
        row,
        col: y,
      });

      if (result.length === FINISH_SIZE) {
        return result;
      }
    }

    return null;
  }

  gameHasFinishedDiagonallyAsc (x, y, value) {
    const result = [];
    let row = x;
    let col = y;

    while (row < BOARD_SIZE && col < BOARD_SIZE) {
      const pos = `${row}${col}`;

      if (this.pieces[pos].value !== value) {
        return null;
      }

      result.push({
        row,
        col,
      });

      if (result.length === FINISH_SIZE) {
        return result;
      }

      row++;
      col++;
    }

    return null;
  }

  gameHasFinishedDiagonallyDesc (x, y, value) {
    const result = [];
    let row = x;
    let col = y;

    while (row < BOARD_SIZE && col >= 0) {
      const pos = `${row}${col}`;

      if (this.pieces[pos].value !== value) {
        return null;
      }

      result.push({
        row,
        col,
      });

      if (result.length === FINISH_SIZE) {
        return result;
      }

      row++;
      col--;
    }

    return null;
  }

  checkResult (value) {
    this.result = null;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        this.result = this.gameHasFinishedHorizontally(row, col, value);
        if (this.result) {
          // console.log(this.pieces);
          // console.log(`horizontally; ${this.result} = ${value}`);
          return;
        }

        this.result = this.gameHasFinishedVertically(row, col, value);
        if (this.result) {
          // console.log(this.pieces);
          // console.log(`vertically; ${this.result} = ${value}`);
          return;
        }

        this.result = this.gameHasFinishedDiagonallyAsc(row, col, value);
        if (this.result) {
          // console.log(this.pieces);
          // console.log(`diagonally1; ${this.result} = ${value}`);
          return;
        }

        this.result = this.gameHasFinishedDiagonallyDesc(row, col, value);
        if (this.result) {
          // console.log(this.pieces);
          // console.log(`diagonally2; ${this.result} = ${value}`);
          return;
        }
      }
    }
  }
}
