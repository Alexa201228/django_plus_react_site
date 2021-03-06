import axios from "axios";
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import {API_PATH} from "../helpers/requiredConst";
import {createMessage, returnErrorMessages} from "./messages";
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
    ACCESS_LINK_EXPIRED, GET_USERS_GROUPS_BY_YEAR, GET_STUDENT_GROUPS, GET_GROUP_STUDENT,
} from "./types";


//Refresh jwt token
const refreshAuthToken = failedRequest =>
    axios
        .post(`${API_PATH}/api/token/refresh`, {
            refresh: localStorage.getItem('refresh_token')
        })
        .then(refreshedToken => {
            localStorage.setItem('access_token', refreshedToken.data.access)
            failedRequest.response.config.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
            return Promise.resolve();
        }).catch(err => {
        if (err.response.data === 400) {
            return null;
        }

    });

createAuthRefreshInterceptor(axios, refreshAuthToken,
    {
        pauseInstanceWhileRefreshing: true
    }
);


//Check token
export const loadUser = () => (dispatch, getState) => {
    dispatch({type: USER_LOADING});
    axios
        .get(`${API_PATH}/api/auth/user`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: USER_LOADED,
                payload: res.data
            });

        }).catch(err => {
        if (err.response.status === 401) {
            dispatch({
                type: AUTH_ERROR,
            });
        } else {
            dispatch(returnErrorMessages(err.response.data, err.response.status))
        }
    });
};

//Mentor MentorLogin
export const mentorLogin = (email, password) => dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({email, password});
    axios
        .post(`${API_PATH}/api/auth/mentor-login`, body, config)
        .then(res => {
            dispatch(createMessage({successfulLogin: `?????????? ????????????????????, ${res.data.user.first_name}`}))
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });

        }).catch(err => {
        dispatch(returnErrorMessages({msg: err.response.data}, {status: err.response.status}));
        dispatch({
            type: LOGIN_FAIL
        });

    });
};


// Student MentorLogin
export const studentLogin = (studentBookNumber, password) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({student_book_number: studentBookNumber, password: password});
    axios
        .post(`${API_PATH}/api/auth/student-login`, body, config)
        .then(res => {
            dispatch(createMessage({successfulLogin: `?????????? ????????????????????, ${res.data.user.first_name}`}))
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });

        }).catch(err => {
        dispatch(returnErrorMessages({msg: err.response.data}, {status: err.response.status}));
        dispatch({
            type: LOGIN_FAIL
        });

    });
};

//Register
export const register = ({email, first_name, last_name, student_group, student_book_number, password}) => dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({email, first_name, last_name, student_group, student_book_number, password});
    axios
        .post(`${API_PATH}/api/auth/register`, body, config)
        .then(res => {
            dispatch(createMessage({email_sent: '???????????? ?????? ???????????????????????????? email ???????????? ???????????????????? ?????? ???? ??????????!'}))
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });
        }).catch(err => {
        dispatch(returnErrorMessages({msg: err.response.data}, {status: err.response.status}));
        dispatch({
            type: REGISTER_FAIL
        });
    });
};

//Logout
export const logout = () => (dispatch, getState) => {

    axios
        .post(`${API_PATH}/api/auth/logout`, JSON.stringify({'refresh_token': localStorage.getItem('refresh_token')}), tokenConfig(getState))
        .then(res => {
            localStorage.clear();
            dispatch({
                type: LOGOUT_SUCCESS
            });
        }).catch(err => {
        dispatch(returnErrorMessages({msg: err.response.data}, {status: err.response.status}));
    });
};

//Email verification
export const emailVerified = (token) => dispatch => {
    axios.get(`${API_PATH}/api/auth/activate/?token=${token}`)
        .then(res => {
            dispatch({
                type: EMAIL_VERIFIED,
                payload: res.data
            });
        }).catch(err => {
        dispatch(returnErrorMessages({msg: err.response.data}, {status: err.response.status}));
    });
};

//Resend email verification link
export const resendEmailVerificationLink = (email) => dispatch => {
    const body = JSON.stringify(email)
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    axios.post(`${API_PATH}/api/auth/activate/`, body, config)
        .then(res => {
            dispatch(createMessage({email_sent: '???????????? ?????? ???????????????????????????? email ???????????? ???????????????? ???????????????????? ?????? ???? ??????????!'}))
        })
        .catch(err => {
            dispatch(returnErrorMessages({msg: err.response.data}, {status: err.response.status}));
        })
}

//Get reset password form
export const getResetPasswordForm = (token) => dispatch => {
    axios.get(`${API_PATH}/api/auth/send-reset-password-link/?token=${token}`)
        .then(res => {
            dispatch({
                type: GET_PASSWORD_RESET_FORM,
                payload: res.data
            });
        }).catch(err => {
        dispatch(returnErrorMessages({msg: err.response.data}, {status: err.response.status}));
        dispatch({
            type: ACCESS_LINK_EXPIRED
        })
    });
}

//Send reset password email link
export const resetPasswordEmailLink = (email) => dispatch => {
    const body = JSON.stringify(email)
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    axios.post(`${API_PATH}/api/auth/send-reset-password-link/`, body, config)
        .then(res => {
            dispatch(createMessage({email_sent: '???????????? ?????? ???????????? ???????????? ???????????????????? ?????? ???? ??????????!'}))
        })
        .catch(err => {
            dispatch(returnErrorMessages({msg: err.response.data}, {status: err.response.status}));
        })
}

//Set new password
export const setNewPassword = ({email, new_password, confirm_password}) => dispatch => {
    const body = JSON.stringify({email, new_password, confirm_password})
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    axios.patch(`${API_PATH}/api/auth/reset-password`, body, config)
        .then(res => {
            dispatch(createMessage({passwordReset: '???????????? ?????????????? ??????????????!'}))
            dispatch({
                type: PASSWORD_RESET,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(returnErrorMessages({msg: err.response.data}, {status: err.response.status}))
        })
}

export const getGroupsByYear = ({year}) => (dispatch, getState) => {
    axios.get(`${API_PATH}/api/student_groups/year?year=${year}`, tokenConfig(getState))
        .then(res => {
                dispatch({
                    type: GET_USERS_GROUPS_BY_YEAR,
                    payload: res.data
                })
            }
        )
        .catch(err => {
            dispatch(returnErrorMessages({msg: err.response.data}, {status: err.response.status}))
        })
}


export const getAllStudentGroups = () => (dispatch, getState) => {
    axios.get(`${API_PATH}/api/student_groups`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_STUDENT_GROUPS,
                payload: res.data
            })
        })
        .catch(err => {
            console.log(err)
            dispatch(returnErrorMessages({msg: err.response.data}, {status: err.response.status}))
        })
}

export const getGroupStudents = (group_name, course_slug) => (dispatch, getState) => {
    axios.get(`${API_PATH}/api/student_groups/group/students?group-name=${group_name}&course=${course_slug}`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_GROUP_STUDENT,
                payload: res.data
            })
        })
        .catch(err => {
             dispatch(returnErrorMessages({msg: err.response.data}, {status: err.response.status}))
        })
}

//Method to delete downloaded file from folder
export const deleteDownloadedReport = (filename) => (dispatch, getState) => {
    axios.delete(`${API_PATH}/api/student_groups/group/students/reports/delete?file=${filename}`, tokenConfig(getState))
        .then(res => {
            console.log('temp file deleted')
        })
        .catch(err => {
            dispatch(returnErrorMessages({msg: err.response.data}, {status: err.response.status}))
        })
}

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

