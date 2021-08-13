import axios from "axios"
import { tokenConfig } from "./auth";
import { returnErrorMessages } from "./messages";
import { GET_QUESTION, GET_TEST } from "./types"

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
        dispatch(returnErrorMessages(err.response.data, err.response.status))
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
        dispatch(returnErrorMessages(err.response.data, err.response.status))
    });
}