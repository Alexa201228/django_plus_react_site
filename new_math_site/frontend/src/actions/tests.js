import axios from "axios"
import { returnErrorMessages } from "./messages";
import { GET_TEST } from "./types"

//Get test by id
export const getTest = (id) => dispatch => {
    axios.get(
        `api/tests/${id}/`
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