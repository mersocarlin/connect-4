import { combineReducers } from 'redux';
import connect4 from './connect4';


const rootReducer = combineReducers({
  connect4,
});


export default rootReducer;
