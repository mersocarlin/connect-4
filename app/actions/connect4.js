export const NEW_GAME = 'NEW_GAME';
export const PLAY_WITH_RED = 'PLAY_WITH_RED';
export const PLAY_WITH_YELLOW = 'PLAY_WITH_YELLOW';

export function newGame () {
  return {
    type: NEW_GAME,
  };
}

export function playWithRed (col) {
  return {
    type: PLAY_WITH_RED,
    col,
  };
}

export function playWithYellow (col) {
  return {
    type: PLAY_WITH_YELLOW,
    col,
  };
}
