import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {getUserTestAnswers} from "../../actions/tests";
import {useParams} from "react-router-dom";
import {Container, MenuItem, Typography} from "@material-ui/core";
import {formatSeconds} from "../../helpers/timerComponent";
import renderHTML from "react-render-html";
import {Dropdown} from "react-bootstrap";


export function StudentTestAnswers() {
    const {user_test_answers} = useSelector((state) => state.tests);
    const {test_id, user_id} = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUserTestAnswers({test_id, user_id}))
    }, [user_id])

    const getRightAnswer = (question) => {
        let rightAnswer = '';
        for (let i = 0; i < question?.answers_to_question?.length; i++) {
            if (question?.answers_to_question?.[i].is_correct) {
                rightAnswer = question?.answers_to_question?.[i].answer_body;
                break;
            }
        }
        return rightAnswer;
    }

    const getUserAnswer = (question) => {
        let answer = [];
        for (let i = 0; i < user_test_answers.chosen_answers.length; i++) {
            if (user_test_answers?.chosen_answers?.[i].question == question.id) {
                answer.push(user_test_answers.chosen_answers[i].answer_body)
            }
        }
        if (answer === []) {
            answer.push('<p style="color: red">Вы не ответили на этот вопрос</p>')
        }
        return answer
    }
    return (
        <>
            {user_test_answers &&
            <Container>
                <Container className={'questionCount'}>
                    Результаты
                </Container>
                <Container className={'testResultsShadowContainer'}>
                    <Container className={'testMark'}>
                        <Container>
                            Итоговый балл:
                        </Container>
                        <Typography className={'testAverage'}>{user_test_answers.test_mark}</Typography>
                    </Container>
                </Container>
                <Container className={'testResultsShadowContainer'}>
                    <Container className={'testMark'}>
                        <Container>
                            Время прохождения теста:
                        </Container>
                        <Typography className={'testAverage'}>{formatSeconds(user_test_answers.test_time)}</Typography>
                    </Container>

                </Container>
                <Container className={'questionCount'}>
                    Вопросы
                </Container>
                {user_test_answers && user_test_answers?.test_questions?.map((quest, index) => (
                    <Container className={'questionShadowContainer'}>
                        <Typography>
                            {renderHTML(quest.question_body)}
                        </Typography>
                        <Dropdown>
                            <MenuItem className={'answersDropDown'}
                            >
                                <Typography className={'correctAnswer'}>Ответ обучающегося:</Typography>
                                {getUserAnswer(quest).map((q, key) => (
                                    renderHTML(q)
                                ))}
                            </MenuItem>
                            <MenuItem className={'answersDropDown'}
                            >
                                <Typography className={'correctAnswer'}>Правильный ответ:</Typography>
                                {renderHTML(getRightAnswer(quest))}
                            </MenuItem>
                        </Dropdown>
                    </Container>

                ))}

            </Container>
            }
        </>
    )
}

export default StudentTestAnswers;