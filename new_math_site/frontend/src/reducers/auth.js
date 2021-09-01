import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    EMAIL_VERIFIED,
  PASSWORD_RESET,
    GET_PASSWORD_RESET_FORM,
    ACCESS_LINK_EXPIRED
  } from '../actions/types';
  
  const initialState = {
    access_token: localStorage.getItem('access_token'),
    refresh_token: localStorage.getItem('refresh_token'),
    isAuthenticated: null,
    isLoading: true,
    user: null,
    isVerified: false,
  };
  
export default function (state = initialState, action) {
  switch (action.type) {
      case USER_LOADING:
        return {
          ...state,
          isLoading: true,
        };
    case USER_LOADED:
        return {
          ...state,
          isAuthenticated: true,
          isLoading: false,
          user: action.payload,
        };
    case LOGIN_SUCCESS:
        localStorage.setItem('access_token', action.payload.access_token);
        localStorage.setItem('refresh_token', action.payload.refresh_token);
        return {
          ...state,
          ...action.payload,
          isAuthenticated: true,
          isLoading: false,
      };
    case GET_PASSWORD_RESET_FORM:
      localStorage.setItem('access_token', action.payload.access_token);
      localStorage.setItem('refresh_token', action.payload.refresh_token);
      return {
        ...state,
        ...action.payload
      }
    
    case EMAIL_VERIFIED:
      return {
        ...state,
        isVerified: true
      }
    case REGISTER_SUCCESS:
        return {
          ...state,
          ...action.payload,
          isLoading: false,
      };
    
    case PASSWORD_RESET:
    case ACCESS_LINK_EXPIRED:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');        
        return {
          ...state,
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        };
    default:
        return state;
    }
  }