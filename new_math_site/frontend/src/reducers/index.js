import { combineReducers } from 'redux';
import courses from './courses';
import auth from "./auth";

export default combineReducers({
    courses,
    auth
});