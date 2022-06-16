import axios from "axios";
import {tokenConfig} from "./auth";
import {createMessage, returnErrorMessages} from "./messages";
import {
    GET_ALL_STUDENT_TEST_ATTEMPTS, GET_JUST_TEST,
    GET_QUESTION,
    GET_TEST,
    GET_TEST_RESULTS,
    GET_TEST_USERS,
    GET_USER_TEST_ANSWERS,
    TRY_TEST_AGAIN
} from "./types"
import {API_PATH} from "../helpers/requiredConst";

//Get test
export const getJustTest = (id) => (dispatch, getState) => {
    console.log(id)
    axios.get(
        `${API_PATH}/api/tests/${id}/`,
        tokenConfig(getState)
    )
        .then(res => {
            dispatch({
                type: GET_JUST_TEST,
                payload: res.data
            })
        })
        .catch(err => {
            if (err.response.status === 401) {
                return null;
            } else {
                dispatch(returnErrorMessages({msg: err.response.data}, {status: err.response.status}))
            }
        });
}

//Get test by id for student
export const getTest = (id, user_id, course_slug) => (dispatch, getState) => {
    console.log(id)
    console.log(user_id)
    axios.get(
        `/api/tests/${id}/get-test?user-id=${user_id}`,
        tokenConfig(getState)
    )
        .then(res => {
            console.log(res)
            dispatch({
                type: GET_TEST,
                payload: res.data
            })
        })
        .catch(err => {
            console.log(err)
            if (err.response.status === 401) {
                return null;
            } else {
                dispatch(returnErrorMessages({msg: err.response.data}, {status: err.response.status}))
                setTimeout(() => {
                    window.location = `/${course_slug}`
                }, 2000)

            }
        });
}

//Get question by id
export const getQuestion = (id) => (dispatch, getState) => {
    axios.get(
        `${API_PATH}/api/questions/${id}/`,
        tokenConfig(getState)
    )
        .then(res => {
            dispatch({
                type: GET_QUESTION,
                payload: res.data
            })
        })
        .catch(err => {
            if (err.response.status === 401) {
                return null;
            } else {
                dispatch(returnErrorMessages({msg: err.response.data}, {status: err.response.status}))
            }
        });
}

//Get Test results
export const testResults = ({test_id, user_chosen_answers, test_time}) => (dispatch, getState) => {
    const body = JSON.stringify({chosen_answers: user_chosen_answers, test_time: test_time})
    axios.post(`${API_PATH}/api/tests/${test_id}/test_results/`, body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({test_finished: `Вы завершили тест!`}));
            dispatch({
                type: GET_TEST_RESULTS,
                payload: res.data
            })
        })
        .catch(err => {
            if (err.response.status === 401) {
                return null;
            } else {
                dispatch(returnErrorMessages({error: err.response.data}, {status: err.response.status}))
            }
        })
}

//Try to pass test again
export const tryTestAgain = (test_id) => (dispatch, getState) => {
    axios.get(
        `${API_PATH}/api/tests/${test_id}/try-again`,
        tokenConfig(getState)
    )
        .then(res => {
            dispatch({
                type: TRY_TEST_AGAIN,
                payload: res.data
            })
        })
        .catch(err => {
            if (err.response.status === 401) {
                return null;
            } else {
                dispatch(returnErrorMessages({error: err.response.data}, {status: err.response.status}))
            }
        });
}

export const getTestUsers = (test_id, group) => {
    return (dispatch, getState) => {
        axios.get(
            `${API_PATH}/api/tests/${test_id}/students?group=${group}`,
            tokenConfig(getState)
        )
            .then(res => {
                dispatch({
                    type: GET_TEST_USERS,
                    payload: res.data
                })
            })
            .catch(err => {
                if (err.response.status === 401) {
                    return null;
                } else {
                    dispatch(returnErrorMessages({error: err.response.data}, {status: err.response.status}))
                }
            })
    };
}


export const getUserTestAnswers = (test_id, user_id) => (dispatch, getState) => {
    axios.get(
        `${API_PATH}/api/tests/${test_id}/students/student-result?user-id=${user_id}`,
        tokenConfig(getState)
    )
        .then(res => {
            dispatch({
                type: GET_USER_TEST_ANSWERS,
                payload: res.data
            })
        })
        .catch(err => {
            if (err.response.status === 401) {
                return null;
            } else {
                dispatch(returnErrorMessages({error: err.response.data}, {status: err.response.status}))
            }
        })
}

export const addTest = (data) => (dispatch, getState) => {
    const body = JSON.stringify(data)
    axios.post(`${API_PATH}/api/tests/add-edit/`, body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({successfulTestAdd: 'Тест добавлен!'}))
        })
        .catch(err => {
            dispatch(returnErrorMessages({error: err.response.data}, {status: err.response.status}))
        })
}


export const editTest = (data) => (dispatch, getState) => {
    const body = JSON.stringify(data)
    axios.patch(`${API_PATH}/api/tests/add-edit/`, body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({successfulTestAdd: 'Тест добавлен!'}));
            dispatch({
                type: GET_TEST,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(returnErrorMessages({error: err.response.data}, {status: err.response.status}))
        })
}

// Method to get all students' test attempts
export const getAllStudentTestAttempts = (test_id, user_id) => (dispatch, getState) => {
    axios.get(`${API_PATH}/api/tests/${test_id}/attempts/students?user-id=${user_id}`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_ALL_STUDENT_TEST_ATTEMPTS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(returnErrorMessages({error: err.response.data}, {status: err.response.status}))
        })
}