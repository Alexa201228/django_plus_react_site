import {Button, Checkbox, Container, FormControlLabel, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";


export function MentorMainAddTestPage() {

    const [lessonItem, setLessonItem] = useState(false);
    const {course} = useSelector(state => state.courses);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('lessonTestName');
        localStorage.removeItem('courseTest');
        localStorage.removeItem('lessonTestId');
        let i = 0
        const j = localStorage.length;
        while(i < j){
            if(localStorage.key(i).includes('answer') || localStorage.key(i).includes('question') || localStorage.key(i).includes('checkbox')){
                localStorage.removeItem(localStorage.key(i))
            }
            else{
                i++
            }
        }
    }, [])

    const handleTestOnLesson = () => {
        setLessonItem(true)
    }

    const handleLessonChoice = (e) => {

        localStorage.setItem('lessonTestId', e.target.value);
        let lesson = course.course_lessons.find(l => l.id == e.target.value)
        localStorage.setItem('lessonTestName', lesson.lesson_name);
        navigate('lesson')
    }

    const handleCourseChoice = (course_id) => {
        localStorage.setItem('courseTest', course_id)
    }

    return (
        <>
            <Container>
                <Container
                    component={Link}
                    to={`/lessons-list/${course.slug}`}
                    className={'backLinkContainer'}>
                    <Typography className={'backLinkText'}>Назад</Typography>
                </Container>
                <Container>
                    <Container className={'testChoiceButtonContainer'}>
                        <Button className={'questionButton'} onClick={handleTestOnLesson}>Тест для урока</Button>
                    </Container>
                    <Container className={'testChoiceButtonContainer'}>
                        <Button className={'questionButton'} component={Link}
                                to={'course'}
                                onClick={() => handleCourseChoice(course.id)}>Тест по окончанию прохождения
                            дисциплины</Button>
                    </Container>

                </Container>

                {lessonItem &&
                <Container>
                    <Container className={'addTestContainer'}>
                        <Typography className='introAddTestText'>
                            Выберите урок для добавления теста
                        </Typography>
                    </Container>
                    <Container>{

                        course.course_lessons.map((lesson, index) => (
                            <FormControlLabel control={<Checkbox key={index} value={lesson.id}
                                                                 onChange={(e) => handleLessonChoice(e)}/>}
                                              label={lesson.lesson_name}/>

                        ))
                    }
                    </Container>
                </Container>
                }
            </Container>
        </>
    )
}

export default MentorMainAddTestPage;