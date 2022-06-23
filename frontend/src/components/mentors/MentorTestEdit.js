import {Button, Checkbox, Container, FormControlLabel, TextField, Typography} from "@material-ui/core";
import {Link, useParams} from "react-router-dom";
import CkeditorComponent from "../../helpers/CkeditorComponent";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {editTest, getJustTest} from "../../actions/tests";
import Delayed from "../../helpers/Delayed";


export function MentorTestEdit() {
    const {test} = useSelector(state => state.tests);
    const dispatch = useDispatch();
    const {test_id} = useParams();
    const [testName, setTestName] = useState(test.title);
    const [testAttempts, setTestAttempts] = useState(test.attempts_amount);
    const [questionList, setQuestionList] = useState(undefined)
    const [value, setValue] = useState();


    useEffect(() => {
        dispatch(getJustTest(test_id))
    }, [test_id])

    useEffect(() => {
        let initQuestionList = []
        for (let i = 0; i < test.questions_on_test.length; i++) {
            let question = {
                question: test.questions_on_test[i].question_body,
                answers: []
            };
            for (let j = 0; j < test.questions_on_test[i].answers_to_question.length; j++) {
                question['answers'].push({
                    answer: test.questions_on_test[i].answers_to_question[j].answer_body,
                    isCorrect: test.questions_on_test[i].answers_to_question[j].is_correct
                })
            }
            initQuestionList.push(question)
        }
        setQuestionList(initQuestionList)
        setTestAttempts(test.attempts_amount)
        setTestName(test.title)

    }, [test_id, test])

    const handleAddQuestion = () => {
        setQuestionList([...questionList, {
            question: '',
            answers: [
                {
                    answer: '',
                    isCorrect: false
                }
            ]
        }])
    }

    const handleRemoveQuestion = (index) => {
        let newQuestionList = [...questionList];
        newQuestionList.splice(index, 1);
        setQuestionList(newQuestionList)
    }

    const handleAddAnswer = (question_id) => {
        let newQuestionList = [...questionList];
        newQuestionList[question_id].answers.push({answer: '', isCorrect: false})
        localStorage.setItem(`checkbox${newQuestionList[question_id].answers.length - 1}${question_id}`, false)
        setQuestionList(newQuestionList)
    }

    const handleRemoveAnswer = (question_id, index) => {
        let newQuestionList = [...questionList];
        newQuestionList[question_id].answers.splice(index, 1);
        setQuestionList(newQuestionList)
    }

    const handleRightAnswerCheck = (question_id, e) => {
        localStorage.setItem(e.target.name, e.target.checked);
    }
    const testNameChange = (e) => {
        setTestName(e.target.value)
    }

    const handleAttemptsAmountChange = (e) => {
        setTestAttempts(e.target.value)
    }

    const handleTestFormSubmit = () => {

        let testData = {};

        testData['test_name'] = testName;
        testData['attempts_amount'] = testAttempts;
        testData['test_id'] = test_id;

        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).includes('answer')) {
                let questionKey = parseInt(localStorage.key(i).slice(localStorage.key(i).indexOf('question') + 8));
                let answerKey = parseInt(localStorage.key(i).slice(localStorage.key(i).indexOf('answer') + 6, localStorage.key(i).indexOf('question')));
                console.log(answerKey)
                console.log(localStorage.getItem(`question${questionKey}`))
                if (!testData.hasOwnProperty(questionKey)) {
                    testData[questionKey] = {
                        question: localStorage.getItem(`question${questionKey}`),
                        answers: {}
                    }
                }


                testData[questionKey]['answers'][answerKey] = {
                    answer: localStorage.getItem(localStorage.key(i)),
                    isCorrect: localStorage.getItem(`checkbox${answerKey}${questionKey}`)
                };

            }
        }
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).includes('answer')) {
                let questionKey = parseInt(localStorage.key(i).slice(localStorage.key(i).indexOf('question') + 8));
                let answerKey = parseInt(localStorage.key(i).slice(localStorage.key(i).indexOf('answer') + 6, localStorage.key(i).indexOf('question')));
                localStorage.removeItem(localStorage.key(i))
                localStorage.removeItem(`question${questionKey}`)
                localStorage.removeItem(`checkbox${answerKey}${questionKey}`)
            }
        }
        dispatch(editTest(testData))
    }

    const setDefaultChecked = (question_id, name, answerKey) => {
        localStorage.setItem(name, questionList[question_id].answers[answerKey].isCorrect)
        return questionList[question_id].answers[answerKey].isCorrect;
    }

    return (
        <>
            {questionList && test && test.questions_on_test &&
            <>
                <Delayed>
                    <Container className={'addTestContainer'}>
                        <Typography className='introAddTestText'>
                            Редактирование теста {test.title}
                        </Typography>
                    </Container>
                    <Container
                        component={Link}
                        to={-1}
                        className={'lessonAddBackLink'}>
                        <Typography className={'backLinkText'}>Назад</Typography>
                    </Container>
                    <Container>
                        <Typography className={'newLessonName'}>Название теста</Typography>
                        <TextField
                            required={true}
                            name={'lessonName'}
                            className='loginRegisterInput'
                            placeholder={'Введите название теста'}
                            variant={'standard'}
                            defaultValue={test.title}
                            onChange={(e) => testNameChange(e)}/>
                    </Container>
                    <Container>
                        <Typography className={'newLessonName'}>Укажите количество попыток прохождения
                            теста:</Typography>
                        <TextField name={'testAttempts'} type={'number'} defaultValue={test.attempts_amount}
                                   InputProps={{inputProps: {min: 1}}}
                                   onChange={(e) => handleAttemptsAmountChange(e)}/>
                    </Container>
                    <Container className={'addTestFormContainer'}>
                        {test.questions_on_test && test.questions_on_test.map((question, index) => (
                            <Container className={'addLessonShadowContainer'}>
                                <Typography className={'ckeditorQuestionLabel'}>Вопрос {index + 1}</Typography>
                                <CkeditorComponent name={`question${index}`} content={question.question_body}/>
                                {question.answers_to_question.map((answer, answerKey) => (
                                    <Container className={'answerContainer'}>
                                        <Typography className={'ckeditorQuestionLabel'}>Ответ:</Typography>
                                        <CkeditorComponent name={`answer${answerKey}question${index}`}
                                                           content={answer.answer_body}/>
                                        <Container>
                                            {questionList[index] && questionList[index].answers[answerKey] && questionList[index].answers[answerKey].isCorrect &&
                                            <FormControlLabel control={
                                                <Checkbox key={index}
                                                          value={answerKey}
                                                          name={`checkbox${answerKey}${index}`}
                                                          defaultChecked={setDefaultChecked(index, `checkbox${answerKey}${index}`, answerKey)}
                                                          onChange={(e) => handleRightAnswerCheck(index, e)}
                                                />}
                                                              label={'Правильный ответ'}/>}

                                        </Container>

                                        <Container button>
                                            {question.answers_to_question.length > 1 && (
                                                <Button
                                                    className={'removeAnswer'}
                                                    onClick={() => handleRemoveAnswer(index, answerKey)}>Удалить
                                                    ответ</Button>
                                            )}
                                        </Container>
                                        <Container>
                                            {(question.answers_to_question.length - 1 === answerKey || question.answers_to_question.length === 0) && (
                                                <Button className={'addAnswer'}
                                                        onClick={() => handleAddAnswer(index)}>Добавить
                                                    ответ</Button>
                                            )}
                                        </Container>
                                    </Container>
                                ))}
                                <Container className={'removeQuestion'}>
                                    {questionList.length > 1 && (
                                        <Button type={'button'}
                                                className={'questionButton'}
                                                onClick={() => handleRemoveQuestion(index)}>Удалить вопрос</Button>
                                    )}
                                </Container>
                                <Container className={'addQuestion'}>
                                    {(questionList.length - 1 === index || questionList.length === 0) && (
                                        <Button type={'button'} className={'questionButton'}
                                                onClick={handleAddQuestion}>Добавить вопрос</Button>
                                    )}
                                </Container>

                            </Container>
                        ))}
                        <Container>
                            <Button className={'addLesson'} onClick={handleTestFormSubmit}>Сохранить</Button>
                        </Container>

                    </Container>
                </Delayed>
            </>
            }
        </>

    )
}

export default MentorTestEdit;