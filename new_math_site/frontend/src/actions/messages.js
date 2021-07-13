import { CREATE_MESSAGES } from "./types";

//Create message
export const createMessage = msg => {
    return {
        type: CREATE_MESSAGES,
        payload: msg
    }
}