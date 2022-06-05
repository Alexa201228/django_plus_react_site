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
    ACCESS_LINK_EXPIRED, GET_USERS_GROUPS_BY_YEAR, GET_STUDENT_GROUPS, GET_GROUP_STUDENT
} from '../actions/types';

const initialState = {
    access_token: localStorage.getItem('access_token'),
    refresh_token: localStorage.getItem('refresh_token'),
    isAuthenticated: null,
    isLoading: true,
    user: null,
    isMentor: false,
    groups: [],
    groupsByYear: [],
    student_group: null
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
                user: action.payload.user,
                isMentor: action.payload.is_mentor
            };
        case LOGIN_SUCCESS:
            localStorage.setItem('access_token', action.payload.access_token);
            localStorage.setItem('refresh_token', action.payload.refresh_token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false,
                isMentor: action.payload.is_mentor
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
                isMentor: false
            };
        case GET_USERS_GROUPS_BY_YEAR:
            return {
                ...state,
                groupsByYear: action.payload.groups
            }
        case GET_STUDENT_GROUPS:
            return {
                ...state,
                groups: action.payload.results
            }
        case GET_GROUP_STUDENT:
            return {
                ...state,
                student_group: action.payload.group_students
            }
        default:
            return state;
    }
}