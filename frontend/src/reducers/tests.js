import {
    GET_ALL_STUDENT_TEST_ATTEMPTS, GET_JUST_TEST,
    GET_QUESTION,
    GET_TEST,
    GET_TEST_RESULTS,
    GET_TEST_USERS,
    GET_USER_TEST_ANSWERS,
    TRY_TEST_AGAIN
} from "../actions/types";

const initialState = {
    test: null,
    question: null,
    questions: [],
    user_chosen_answers: {},
    correct_answers: {},
    result: null,
    is_passed: false,
    finished: false,
    test_users: [],
    user_test_answers: [],
    student_test_attempts: [],
    questions_amount: 20,
    chosen_questions: [],
}


export default function (state = initialState, action) {
    switch (action.type) {
        case GET_JUST_TEST:
            return {
                ...state,
                test: action.payload,
                questions: action.payload.questions_on_test,
                user_chosen_answers: clearChosenAnswers(action.payload.questions_on_test),
                correct_answers: {},
                test_users: [],
                user_test_answers: [],
                chosen_questions: []
            }
        case GET_TEST_USERS:
            return {
                ...state,
                test_users: action.payload.students
            }
        case GET_USER_TEST_ANSWERS:
            return {
                ...state,
                user_test_answers: action.payload.test_results
            }
        case GET_TEST:
            return {
                ...state,
                test: action.payload.test,
                questions: action.payload.test.questions_on_test,
                user_chosen_answers: clearChosenAnswers(action.payload.test.questions_on_test),
                correct_answers: {},
                test_users: [],
                user_test_answers: [],
                chosen_questions: []
            }
        case GET_QUESTION:
            return {
                ...state,
                question: action.payload,
            }
        case GET_TEST_RESULTS:

            return {
                ...state,
                result: action.payload.result,
                correct_answers: {
                    ...state.correct_answers, ...action.payload.correct_answers
                },
                is_passed: action.payload.is_passed,
                finished: action.payload.finished,
                chosen_questions: []
            }

        case TRY_TEST_AGAIN:
            return {
                ...state,
                finished: false,
                user_chosen_answers: clearChosenAnswers(action.payload.questions_on_test),
                correct_answers: {},
                test_users: [],
                user_test_answers: [],
                chosen_questions: []
            }
        case GET_ALL_STUDENT_TEST_ATTEMPTS:
            return {
                ...state,
                student_test_attempts: action.payload.test_results,
                test_users: action.payload.test_users
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