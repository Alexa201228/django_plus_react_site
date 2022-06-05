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
    console.log(useParams())
    const {test_id, attempt_id} = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUserTestAnswers(test_id, attempt_id))
    }, [attempt_id])

    const getRightAnswers = (question) => {
        let rightAnswers = [];
        for (let i = 0; i < question?.answers_to_question?.length; i++) {
            if (question?.answers_to_question?.[i].is_correct) {
                rightAnswers.push(question?.answers_to_question?.[i].answer_body);
            }
        }
        return rightAnswers;
    }

    const getUserAnswer = (question) => {
        let answer = [];
        for (let i = 0; i < user_test_answers.chosen_answers.length; i++) {
            if (user_test_answers?.chosen_answers?.[i].question == question.id) {
                answer.push(user_test_answers.chosen_answers[i].answer_body)
            }
        }
        if (answer.length < 1) {
            answer.push('<p style="color: red">Студент не ответил на данный вопрос</p>')
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
                                {getRightAnswers(quest).map((q, k) => (
                                    renderHTML(q)
                                ))}
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