import axios from "axios"
import { tokenConfig } from "./auth";
import { createMessage, returnErrorMessages } from "./messages";
import { GET_QUESTION, GET_TEST, GET_TEST_RESULTS, TRY_TEST_AGAIN } from "./types"

//Get test by id
export const getTest = (id) => (dispatch, getState) => {
    axios.get(
        `api/tests/${id}/`,
        tokenConfig(getState)
    )
    .then(res =>{
        dispatch({
            type: GET_TEST,
            payload: res.data
        })
    })
    .catch(err => {
        if(err.response.status === 401){
            return null;
        }
        else{
            dispatch(returnErrorMessages(err.response.data, err.response.status))
        }
    });
}

//Get question by id
export const getQuestion = (id) =>(dispatch, getState) => {
    axios.get(
        `api/questions/${id}/`,
        tokenConfig(getState)
    )
    .then(res => {
        dispatch({
            type: GET_QUESTION,
            payload: res.data
        })
    })
    .catch(err => {
        if(err.response.status === 401){
            return null;
        }
        else{
            dispatch(returnErrorMessages(err.response.data, err.response.status))
        }
    });
}

//Get Test results
export const testResults = ({test_id, chosen_answers}) => (dispatch, getState) =>{

    axios.post(`/api/tests/${test_id}/test_results/`, chosen_answers, tokenConfig(getState))
    .then(res =>{
        dispatch(createMessage({test_finished:'Вы завершили тест!'}));
        dispatch({
            type: GET_TEST_RESULTS,
            payload: res.data
        })
    })
    .catch(err =>{
        if(err.response.status === 401){
            return null;
        }
        else{
            dispatch(returnErrorMessages(err.response.data, err.response.status))
        }
    })
}

//Try to pass test again
export const tryTestAgain = (test_id) => (dispatch, getState) => {
    axios.get(
        `api/tests/${test_id}/`,
        tokenConfig(getState)
    )
    .then(res =>{
        dispatch({
            type: TRY_TEST_AGAIN,
            payload: res.data
        })
    })
    .catch(err => {
        if(err.response.status === 401){
            return null;
        }
        else{
            dispatch(returnErrorMessages(err.response.data, err.response.status))
        }
    });
}