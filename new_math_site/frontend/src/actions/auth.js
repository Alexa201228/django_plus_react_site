import axios from "axios";
import { createMessage } from "./messages";
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    GET_ERRORS
} from "./types";

//Check token
export const loadUser = () => (dispatch, getState) => {
    dispatch({ type: USER_LOADING });

    axios
        .get('/api/auth/user', tokenConfig(getState))
        .then(res => {
            dispatch({
                type: USER_LOADED,
                payload: res.data
            });

        }).catch(err => {
            console.log(err);
            dispatch({
                type: AUTH_ERROR
            });
        });
};

//Login
export const login = (email, password) => dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ email, password });

    axios
        .post('/api/auth/login', body, config)
        .then(res => {
            dispatch(createMessage({successfulLogin: 'You have been successfully logged in!'}))
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });

        }).catch(err => {
            console.log(err);
            dispatch({
                type: LOGIN_FAIL
            });
        });
};

//Register
export const register = ({ first_name, email, password }) => dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ first_name, email, password });

    axios
        .post('/api/auth/register', body, config)
        .then(res => {
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });

        }).catch(err => {
            const errors = {
                msg: err.response.data,
                status: err.response.status
            };
            dispatch({
                type: GET_ERRORS,
                payload: errors
            });
        });
};

//Logout
export const logout = () => (dispatch, getState) => {

    axios
        .post('/api/auth/logout', null, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: LOGOUT_SUCCESS
            });

        }).catch(err => {
            console.log(err);
        });
};

//Setup config
export const tokenConfig = getState => {
    const token = getState().auth.token;

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config
}
