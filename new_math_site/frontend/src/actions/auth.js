import axios from "axios";
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS
} from "./types";

//Check token
export const loadUser = () => (dispatch, getState) => {
    dispatch({ type: USER_LOADING });

    const token = getState().auth.token;

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    axios
        .get('/api/auth/user', config)
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

//Logout
export const logout = () => (dispatch, getState) => {

    const token = getState().auth.token;

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    axios
        .post('/api/auth/logout', null, config)
        .then(res => {
            dispatch({
                type: LOGOUT_SUCCESS
            });

        }).catch(err => {
            console.log(err.response);
        });
};