import { GET_QUESTION, GET_TEST, GET_TEST_RESULTS } from "../actions/types";

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
        case GET_TEST_RESULTS:
            return{
                ...state,
                correct_answers:{
                    ...state.correct_answers, ...action.payload.correct_answers
                },
                is_passed: action.payload.is_passed,
                finished: action.payload.finished, 
            }
        default:
            return state;
    }
}