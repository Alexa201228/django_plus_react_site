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
                    isCorrect: questionList[questionKey].answers[answerKey].isCorrect
                };

                console.log(testData)
            }
        }
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).includes('answer')) {
                let questionKey = parseInt(localStorage.key(i).slice(localStorage.key(i).indexOf('question') + 8));

                localStorage.removeItem(localStorage.key(i))
                localStorage.removeItem(`question${questionKey}`)
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
                    ???????????????????? ??????????
                    ?? {localStorage.hasOwnProperty('lessonTestName') ? `?????????? ${localStorage.getItem('lessonTestName')}` : `?????????? ${course.title}`}
                </Typography>
            </Container>
            <Container
                component={Link}
                to={-1}
                className={'lessonAddBackLink'}>
                <Typography className={'backLinkText'}>??????????</Typography>
            </Container>
            <Container>
                <Typography className={'newLessonName'}>???????????????? ??????????</Typography>
                <TextField
                    required={true}
                    name={'lessonName'}
                    className='loginRegisterInput'
                    placeholder={'?????????????? ???????????????? ??????????'}
                    variant={'standard'}
                    onChange={(e) => testNameChange(e)}/>
            </Container>
            <Container>
                <Typography className={'newLessonName'}>?????????????? ???????????????????? ?????????????? ?????????????????????? ??????????:</Typography>
                <TextField name={'testAttempts'} type={'number'} defaultValue={1}
                InputProps={{ inputProps: { min: 1 } }}
                onChange={(e) => handleAttemptsAmountChange(e)}/>
            </Container>
            <Container className={'addTestFormContainer'}>
                {questionList.map((question, index) => (
                    <Container className={'addLessonShadowContainer'}>
                        <Typography className={'ckeditorQuestionLabel'}>???????????? {index + 1}</Typography>
                        <CkeditorComponent name={`question${index}`} content={''}/>
                        {question.answers.map((answer, answerKey) => (
                            <Container className={'answerContainer'}>
                                <Typography className={'ckeditorQuestionLabel'}>??????????:</Typography>
                                <CkeditorComponent name={`answer${answerKey}question${index}`} content={''}/>
                                <Container>
                                    <FormControlLabel control={
                                        <Checkbox key={index}
                                                  value={answerKey}
                                                  name={`checkbox${answerKey}${index}`}
                                                  onChange={(e) => handleRightAnswerCheck(index, e)}/>}
                                                      label={'???????????????????? ??????????'}/>
                                </Container>

                                <Container button>
                                    {question.answers.length > 1 && (
                                        <Button onClick={() => handleRemoveAnswer(index, answerKey)}
                                                className={'removeAnswer'}>??????????????
                                            ??????????</Button>
                                    )}
                                </Container>
                                <Container>
                                    {question.answers.length - 1 === answerKey && (
                                        <Button onClick={() => handleAddAnswer(index)} className={'addAnswer'}>????????????????
                                            ??????????</Button>
                                    )}
                                </Container>
                            </Container>
                        ))}
                        <Container className={'removeQuestion'}>
                            {questionList.length > 1 && (
                                <Button type={'button'} className={'questionButton'}
                                        onClick={() => handleRemoveQuestion(index)}>??????????????
                                    ????????????</Button>
                            )}
                        </Container>
                        <Container className={'addQuestion'}>
                            {questionList.length - 1 === index && (
                                <Button type={'button'} className={'questionButton'} onClick={handleAddQuestion}>????????????????
                                    ????????????</Button>
                            )}
                        </Container>

                    </Container>
                ))}
                <Container>
                    <Button onClick={handleTestFormSubmit} className={'addLesson'}>??????????????????</Button>
                </Container>

            </Container>

        </>
    )
}

export default MentorAddTest;