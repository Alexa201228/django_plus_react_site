import { combineReducers } from 'redux';
import courses from './courses';
import auth from "./auth";
import errors from './errors';
import messages from './messages';

export default combineReducers({
    courses,
    auth,
    errors,
    messages
});