import axios from "axios";
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import { createMessage, returnErrorMessages } from "./messages";
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
} from "./types";



//Refresh jwt token
const refreshAuthToken = failedRequest =>
    axios
        .post('/api/token/refresh', {
        refresh: localStorage.getItem('refresh_token')
    })
        .then(refreshedToken => {
            localStorage.setItem('access_token', refreshedToken.data.access)
            failedRequest.response.config.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
            return Promise.resolve();
    }).catch(err => {
        return Promise.reject(err);
});

createAuthRefreshInterceptor(axios, refreshAuthToken,
    {
    pauseInstanceWhileRefreshing: true
}
);


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
            dispatch({
                type: AUTH_ERROR,
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
            dispatch(returnErrorMessages(err.response.data, err.response.status));
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
            dispatch(returnErrorMessages(err.response.data, err.response.status));
            dispatch({
                type: REGISTER_FAIL
            });
        });
};

//Logout
export const logout = () => (dispatch, getState) => {

    axios
        .post('/api/auth/logout', null, tokenConfig(getState))
        .then(res => {
            localStorage.clear();
            dispatch({
                type: LOGOUT_SUCCESS
            });
        }).catch(err => {
            console.log(err.response);
            dispatch(returnErrorMessages(err.response.data, err.response.status));
        });
};


//Setup config
export const tokenConfig = getState => {
    const token = getState().auth.access_token;
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

