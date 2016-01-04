import {
  PLAY_WITH_RED,
  PLAY_WITH_YELLOW,
} from '../actions/connect4';

import Board from '../domain/board';

export const RED_TURN = 1;
export const YELLOW_TURN = 2;


const initialState = {
  board: new Board(),
  playingNow: RED_TURN,
};

export default function counter (state = initialState, action) {
  switch (action.type) {
    case PLAY_WITH_RED:
    case PLAY_WITH_YELLOW:
      const { board } = state;
      const value = action.type === PLAY_WITH_RED ? RED_TURN : YELLOW_TURN;

      board.playAtColWithValue(action.col, value);

      return {
        board,
        playingNow: action.type === PLAY_WITH_RED ? YELLOW_TURN : RED_TURN,
      };
    default:
      return state;
  }
}
