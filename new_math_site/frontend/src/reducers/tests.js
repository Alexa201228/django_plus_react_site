import { GET_QUESTION, GET_TEST, GET_TEST_RESULTS, TRY_TEST_AGAIN } from "../actions/types";

const initialState = {
    test: null,
    question: null,
    questions: [],
    chosen_answers: {},
    correct_answers: {},
    result: null,
    is_passed: false,
    finished: false
}


export default function(state = initialState, action) {

    switch(action.type){
        case GET_TEST:
            return {
                ...state,
                test: action.payload,
                questions: action.payload.questions_on_test,
                chosen_answers:{
                    ...state.chosen_answers, ...clearChosenAnswers(action.payload.questions_on_test)
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
                result: action.payload.result,
                correct_answers:{
                    ...state.correct_answers, ...action.payload.correct_answers
                },
                is_passed: action.payload.is_passed,
                finished: action.payload.finished, 
            }

        case TRY_TEST_AGAIN:
            return{
                ...state, 
                finished: false,
                chosen_answers:{
                    ...state.chosen_answers, ...clearChosenAnswers(action.payload.questions_on_test)
                }
            }
        default:
            return state;
    }
}

const clearChosenAnswers = (questions) => {
    const answers = {};
    questions.forEach(q => {
        answers[q.id] = []
    });
    return answers;
}