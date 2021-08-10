import { GET_TEST } from "../actions/types";

const initialState = {
    test: null,
    questions: [],
    chosen_answers: [],
    correct_answers: []
}


export default function(state = initialState, action) {
    switch(action.type){
        case GET_TEST:
            return {
                ...state,
                test: action.payload
            }
        default:
            return state;
    }
}