import { config } from '../env/';
import status from './status';
import strings from './strings';


export const Status = status;

export const Strings = strings[config.language];

export default { };
