import CkeditorComponent from "../../helpers/CkeditorComponent";
import {Button, Checkbox, Container, FormControlLabel, TextField, Typography} from "@material-ui/core";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {addTest} from "../../actions/tests";


export function MentorAddTest() {

    const {course} = useSelector(state => state.courses);
    const dispatch = useDispatch();

    const [questionList, setQuestionList] = useState(
        [
            {
                question: '',
                answers: [
                    {
                        answer: '',
                        isCorrect: false
                    }
                ]
            }
        ]
    )

    const [testName, setTestName] = useState('');
    const [testAttempts, setTestAttempts] = useState(1);

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
        let newQuestionList = [...questionList];
        newQuestionList[question_id].answers[e.target.value].isCorrect = e.target.checked;
        localStorage.setItem(e.target.name, e.target.checked);
        setQuestionList(newQuestionList)
    }

    const handleAttemptsAmountChange = (e) => {
        setTestAttempts(e.target.value)
    }

    const handleTestFormSubmit = () => {
        let testData = {};

        testData['test_name'] = testName;
        testData['attempts_amount'] = testAttempts;

        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).includes('answer')) {
                let questionKey = parseInt(localStorage.key(i).slice(localStorage.key(i).indexOf('question') + 8));
                let answerKey = parseInt(localStorage.key(i).slice(localStorage.key(i).indexOf('answer') + 6, localStorage.key(i).indexOf('question')));
                console.log(answerKey)
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

                console.log(testData)
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
        if (localStorage.hasOwnProperty('lessonTestId')) {
            testData['lesson_id'] = localStorage.getItem('lessonTestId')
        }
        if (localStorage.hasOwnProperty('courseTest')) {
            testData['course_id'] = localStorage.getItem('courseTest')
        }
        dispatch(addTest(testData))
    }

    const testNameChange = (e) => {
        setTestName(e.target.value)
    }

    return (
        <>
            <Container className={'addTestContainer'}>
                <Typography className='introAddTestText'>
                    Добавление теста
                    к {localStorage.hasOwnProperty('lessonTestName') ? `уроку ${localStorage.getItem('lessonTestName')}` : `курсу ${course.title}`}
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
                    onChange={(e) => testNameChange(e)}/>
            </Container>
            <Container>
                <Typography className={'newLessonName'}>Укажите количество попыток прохождения теста:</Typography>
                <TextField name={'testAttempts'} type={'number'} defaultValue={1}
                           InputProps={{inputProps: {min: 1}}}
                           onChange={(e) => handleAttemptsAmountChange(e)}/>
            </Container>
            <Container className={'addTestFormContainer'}>
                {questionList.map((question, index) => (
                    <Container className={'addLessonShadowContainer'}>
                        <Typography className={'ckeditorQuestionLabel'}>Вопрос {index + 1}</Typography>
                        <CkeditorComponent name={`question${index}`} content={''}/>
                        {question.answers.map((answer, answerKey) => (
                            <Container className={'answerContainer'}>
                                <Typography className={'ckeditorQuestionLabel'}>Ответ:</Typography>
                                <CkeditorComponent name={`answer${answerKey}question${index}`} content={''}/>
                                <Container>
                                    <FormControlLabel control={
                                        <Checkbox key={index}
                                                  value={answerKey}
                                                  name={`checkbox${answerKey}${index}`}
                                                  onChange={(e) => handleRightAnswerCheck(index, e)}/>}
                                                      label={'Правильный ответ'}/>
                                </Container>

                                <Container button>
                                    {question.answers.length > 1 && (
                                        <Button onClick={() => handleRemoveAnswer(index, answerKey)}
                                                className={'removeAnswer'}>Удалить
                                            ответ</Button>
                                    )}
                                </Container>
                                <Container>
                                    {question.answers.length - 1 === answerKey && (
                                        <Button onClick={() => handleAddAnswer(index)} className={'addAnswer'}>Добавить
                                            ответ</Button>
                                    )}
                                </Container>
                            </Container>
                        ))}
                        <Container className={'removeQuestion'}>
                            {questionList.length > 1 && (
                                <Button type={'button'} className={'questionButton'}
                                        onClick={() => handleRemoveQuestion(index)}>Удалить
                                    вопрос</Button>
                            )}
                        </Container>
                        <Container className={'addQuestion'}>
                            {questionList.length - 1 === index && (
                                <Button type={'button'} className={'questionButton'} onClick={handleAddQuestion}>Добавить
                                    вопрос</Button>
                            )}
                        </Container>

                    </Container>
                ))}
                <Container>
                    <Button onClick={handleTestFormSubmit} className={'addLesson'}>Сохранить</Button>
                </Container>

            </Container>

        </>
    )
}

export default MentorAddTest;