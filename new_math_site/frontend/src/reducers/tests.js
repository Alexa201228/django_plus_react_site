import { GET_QUESTION, GET_TEST } from "../actions/types";

const initialState = {
    test: null,
    question: null,
    questions: [],
    chosen_answers: {},
    correct_answers: {},
    is_passed: false,
    finished: false
}


export default function(state = initialState, action) {
    switch(action.type){
        case GET_TEST:
            const answers = {};
            action.payload.questions_on_test.forEach(q => {
                answers[q.id] = []
            });
            return {
                ...state,
                test: action.payload,
                questions: action.payload.questions_on_test,
                chosen_answers:{
                    ...state.chosen_answers, ...answers
                }
            }
        case GET_QUESTION:
            return{
                ...state,
                question: action.payload,
            }
        default:
            return state;
    }
}