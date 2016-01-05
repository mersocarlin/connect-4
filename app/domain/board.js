
export const BOARD_SIZE = 7;
export const FINISH_SIZE = 4;
export const PIECE_SIZE = 80;

export default class Board {
  constructor () {
    this.initiate();
  }

  initiate () {
    this.pieces = { };

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        this.pieces[`${row}${col}`] = 0;
      }
    }
  }

  getValueAt (row, col) {
    return this.pieces[`${row}${col}`];
  }

  playAtColWithValue (col, value) {
    for (let row = 0; row < BOARD_SIZE; row++) {
      const pos = `${row}${col}`;

      if (this.pieces[pos] === 0) {
        this.pieces[pos] = value;
        break;
      }
    }

    this.gameIsFinished(value);
  }

  gameIsFinishedHorizontally (x, y, value) {
    const result = [];

    for (let col = y; col < BOARD_SIZE; col++) {
      const pos = `${x}${col}`;

      if (this.pieces[pos] !== value) {
        return null;
      }

      result.push(pos);

      if (result.length === FINISH_SIZE) {
        return result;
      }
    }

    return null;
  }

  gameIsFinishedVertically (x, y, value) {
    const result = [];

    for (let row = x; row < BOARD_SIZE; row++) {
      const pos = `${row}${y}`;

      if (this.pieces[pos] !== value) {
        return null;
      }

      result.push(pos);

      if (result.length === FINISH_SIZE) {
        return result;
      }
    }

    return null;
  }

  gameIsFinishedDiagonallyAsc (x, y, value) {
    const result = [];
    let row = x;
    let col = y;

    while (row < BOARD_SIZE || col < BOARD_SIZE) {
      const pos = `${row}${col}`;

      if (this.pieces[pos] !== value) {
        return null;
      }

      result.push(pos);

      if (result.length === FINISH_SIZE) {
        return result;
      }

      row++;
      col++;
    }

    return null;
  }

  gameIsFinishedDiagonallyDesc (x, y, value) {
    const result = [];
    let row = x;
    let col = y;

    while (row >= 0 || col >= 0) {
      const pos = `${row}${col}`;

      if (this.pieces[pos] !== value) {
        return null;
      }

      result.push(pos);

      if (result.length === FINISH_SIZE) {
        return result;
      }

      row--;
      col--;
    }

    return null;
  }

  gameIsFinished (value) {
    let result = null;

    for (let row = 0; row < BOARD_SIZE; row++) {
      if (result) {
        break;
      }

      for (let col = 0; col < BOARD_SIZE; col++) {
        result = this.gameIsFinishedHorizontally(row, col, value);
        if (result) {
          console.log(this.pieces);
          console.log(`horizontally; ${result} = ${value}`);
          break;
        }

        result = this.gameIsFinishedVertically(row, col, value);
        if (result) {
          console.log(this.pieces);
          console.log(`vertically; ${result} = ${value}`);
          break;
        }

        result = this.gameIsFinishedDiagonallyAsc(row, col, value);
        if (result) {
          console.log(this.pieces);
          console.log(`diagonally1; ${result} = ${value}`);
          break;
        }

        result = this.gameIsFinishedDiagonallyDesc(row, col, value);
        if (result) {
          console.log(this.pieces);
          console.log(`diagonally2; ${result} = ${value}`);
          break;
        }
      }
    }
  }

  getPieces () {
    return this.pieces;
  }
}
