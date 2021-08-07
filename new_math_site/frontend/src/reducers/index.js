import { combineReducers } from 'redux';
import courses from './courses';
import auth from "./auth";
import errors from './errors';
import messages from './messages';
import tests from './tests';

export default combineReducers({
    courses,
    auth,
    tests,
    errors,
    messages
});