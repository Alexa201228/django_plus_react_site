import { CREATE_MESSAGES, GET_ERRORS } from "./types";


//Create message for alert
export const createMessage = msg => {
    return {
        type: CREATE_MESSAGES,
        payload: msg
    }
}

//Return error messages from server
export const returnErrorMessages = (msg, status) => {
    return {
        type: GET_ERRORS,
        payload: { msg, status },
    }
}