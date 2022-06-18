import {Button, Container, TextField, Typography} from "@material-ui/core";
import {Link, useNavigate} from "react-router-dom";
import CkeditorComponent from "../../helpers/CkeditorComponent";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {editLesson} from "../../actions/courses";


export function MentorLessonEdit() {

    const {course, lesson} = useSelector(state => state.courses);
    const [lessonName, setLessonName] = useState(lesson.lesson_name);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log(lesson)

    const lessonNameChange = (e) => {
        setLessonName(e.target.value)
    }

    const handleSubmit = () => {
        let lessonText = localStorage.getItem('lessonText');
        localStorage.removeItem('lessonText');
        const lesson_id = lesson.id;

        dispatch(editLesson(
            lesson_id,
            lessonName,
            lessonText))
        navigate(`/lessons-list/${course.slug}`)
    }

    return (
        <>
            <Container className={'addTestContainer'}>
                <Typography className='introAddTestText'>Редактирование урока {lesson.lesson_name}</Typography>

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
                            defaultValue={lesson.lesson_name}
                            onChange={(e) => lessonNameChange(e)}/>
                    </Container>

                    <Container>
                        <Typography className={'newLessonName'}>Текст лекции</Typography>
                        <CkeditorComponent name={'lessonText'} content={lesson.body}/>
                    </Container>
                </Container>


                <Container className={'addButtonContainer'}>
                    <Button onClick={handleSubmit} className={'addLesson'}>Сохранить</Button>
                </Container>

            </Container>
        </>
    )
}

export default MentorLessonEdit;