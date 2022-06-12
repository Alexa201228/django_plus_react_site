import {Button, Container, FormControlLabel, TextField, Typography} from "@material-ui/core";
import CkeditorComponent from "../../helpers/CkeditorComponent";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addLesson} from "../../actions/courses";
import {Link, useNavigate} from "react-router-dom";


export function MentorAddLesson() {

    const [lessonName, setLessonName] = useState('');
    const {course} = useSelector(state => state.courses);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = () => {
        let lessonText = localStorage.getItem('lessonText');
        localStorage.removeItem('lessonText');
        const course_id = course.id;

        dispatch(addLesson(
            course_id,
            lessonName,
            lessonText))
        navigate(`/lessons-list/${course.slug}`)
    }

    const lessonNameChange = (e) => {
        setLessonName(e.target.value)
    }

    return (
        <>
            <Container className={'addTestContainer'}>
                <Typography className='introAddTestText'>Добавление урока к курсу {course.title}</Typography>

            </Container>
            <Container
                component={Link}
                to={-1}
                className={'lessonAddBackLink'}>
                <Typography className={'backLinkText'}>Назад</Typography>
            </Container>

            <Container>
                <Container className={'addLessonShadowContainer'}>
                    <Container>
                        <Typography className={'newLessonName'}>Название лекции</Typography>
                        <TextField
                            name={'lessonName'}
                            className='loginRegisterInput'
                            placeholder={'Введите название урока'}
                            variant={'standard'}
                            onChange={(e) => lessonNameChange(e)}/>
                    </Container>

                    <Container>
                        <Typography className={'newLessonName'}>Текст лекции</Typography>
                        <CkeditorComponent name={'lessonText'} content={''}/>
                    </Container>
                </Container>


                <Container className={'addButtonContainer'}>
                    <Button onClick={handleSubmit} className={'addLesson'}>Сохранить</Button>
                </Container>

            </Container>
        </>
    )
}

export default MentorAddLesson;