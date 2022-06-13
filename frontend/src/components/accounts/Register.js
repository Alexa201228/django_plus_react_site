import React from 'react';
import {Link, Navigate} from 'react-router-dom';
import {connect, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Fragment} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {ErrorMessage} from "@hookform/error-message";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import {Typography} from '@material-ui/core';

import {register} from '../../actions/auth';
import {REQUIRED_FIELD} from '../../helpers/requiredConst';
import './../../styles/registerLoginForms.css'


export function Register(props) {

    //Define controls for form validation
    const {
        control,
        formState,
        formState: {errors},
        handleSubmit,
        watch
    } = useForm({
        mode: "onChange",
        criteriaMode: "all"
    });
    const {user} = useSelector(state => state.auth);

    //Add watch on input fields to get values
    const first_name = watch('first_name');
    const last_name = watch('last_name');
    const email = watch('email');
    const password = watch('password');
    const student_group = watch('student_group');
    const student_book_number = watch('student_book_number');


    function onSubmit() {
        const newUser = {
            email,
            first_name,
            last_name,
            student_group,
            student_book_number,
            password
        };
        props.register(newUser);
    }

    if (props.isAuthenticated) {
        return <Navigate to={`/user/profile/${user?.id}`}/>;
    }


    return (
        <Fragment>
            <Container style={{display: "flex"}}>
                <Container className='mentorLogin'>
                    <Container>
                        <Typography className='mentorLoginLabel'>Зарегистрироваться</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Container>
                                <Box>
                                    <Typography className='loginLabelText'>Email</Typography>
                                    <Controller
                                        render={({field}) =>
                                            <TextField
                                                className='loginRegisterInput'
                                                {...field}
                                                variant="standard"
                                                placeholder={'Введите email'}
                                                autoFocus
                                            />}
                                        control={control}
                                        name="email"
                                        rules={{
                                            required: {
                                                value: true,
                                                message: REQUIRED_FIELD
                                            },
                                            pattern: {
                                                value: /^(([^<>()\[\]\.,;:\s@\']+(\.[^<>()\[\]\.,;:\s@\']+)*)|(\'.+\'))@(([^<>()[\]\.,;:\s@\']+\.)+[^<>()[\]\.,;:\s@\']{2,})$/i,
                                                message: "Please enter valid email"
                                            }
                                        }}
                                        defaultValue=""
                                    >
                                    </Controller>
                                    <ErrorMessage
                                        errors={errors}
                                        name="email"
                                        render={({messages}) => {
                                            return messages
                                                ? Object.entries(messages).map(([type, message]) => (
                                                    <Typography
                                                        paragraph={true}
                                                        style={{color: 'red'}}
                                                        key={type}>{message}</Typography>
                                                ))
                                                : null;
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Typography className='loginLabelText'>Имя</Typography>
                                    <Controller
                                        render={({field}) =>
                                            <TextField
                                                {...field}
                                                className='loginRegisterInput'
                                                placeholder={'Введите имя'}
                                                fullWidth
                                                variant="standard"
                                                autoComplete="on"
                                            />}
                                        name="first_name"
                                        control={control}
                                        rules={{
                                            required: {
                                                value: true,
                                                message: REQUIRED_FIELD
                                            }
                                        }}
                                        defaultValue=""
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="first_name"
                                        render={({messages}) => {
                                            return messages
                                                ? Object.entries(messages).map(([type, message]) => (
                                                    <Typography
                                                        paragraph={true}
                                                        style={{color: 'red'}}
                                                        key={type}>{message}</Typography>
                                                ))
                                                : null;
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Typography className='loginLabelText'>Фамилия</Typography>
                                    <Controller
                                        render={({field}) =>
                                            <TextField
                                                {...field}
                                                className='loginRegisterInput'
                                                placeholder={'Введите фамилию'}
                                                fullWidth
                                                variant="standard"
                                                autoComplete="on"
                                            />}
                                        name="last_name"
                                        control={control}
                                        rules={{
                                            required: {
                                                value: true,
                                                message: REQUIRED_FIELD
                                            }
                                        }}
                                        defaultValue=""
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="last_name"
                                        render={({messages}) => {
                                            return messages
                                                ? Object.entries(messages).map(([type, message]) => (
                                                    <Typography
                                                        paragraph={true}
                                                        style={{color: 'red'}}
                                                        key={type}>{message}</Typography>
                                                ))
                                                : null;
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Typography className='loginLabelText'>Группа</Typography>
                                    <Controller
                                        render={({field}) =>
                                            <TextField
                                                {...field}
                                                className='loginRegisterInput'
                                                placeholder={'Введите группу'}
                                                fullWidth
                                                variant="standard"
                                                autoComplete="on"
                                            />}
                                        name="student_group"
                                        control={control}
                                        rules={{
                                            required: {
                                                value: true,
                                                message: REQUIRED_FIELD
                                            }
                                        }}
                                        defaultValue=""
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="student_group"
                                        render={({messages}) => {
                                            return messages
                                                ? Object.entries(messages).map(([type, message]) => (
                                                    <Typography
                                                        paragraph={true}
                                                        style={{color: 'red'}}
                                                        key={type}>{message}</Typography>
                                                ))
                                                : null;
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Typography className='loginLabelText'>Номер зачетной книжки</Typography>
                                    <Controller
                                        render={({field}) =>
                                            <TextField
                                                {...field}
                                                className='loginRegisterInput'
                                                placeholder={'Введите номер зачетной книжки'}
                                                fullWidth
                                                variant="standard"
                                                autoComplete="on"
                                            />}
                                        name="student_book_number"
                                        control={control}
                                        rules={{
                                            required: {
                                                value: true,
                                                message: REQUIRED_FIELD
                                            }
                                        }}
                                        defaultValue=""
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="student_book_number"
                                        render={({messages}) => {
                                            return messages
                                                ? Object.entries(messages).map(([type, message]) => (
                                                    <Typography
                                                        paragraph={true}
                                                        style={{color: 'red'}}
                                                        key={type}>{message}</Typography>
                                                ))
                                                : null;
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Typography className='loginLabelText'>Пароль</Typography>
                                    <Controller
                                        render={({field}) =>
                                            <TextField
                                                {...field}
                                                className='loginRegisterInput'
                                                fullWidth
                                                variant="standard"
                                                placeholder={'Введите пароль'}
                                                type="Password"/>}
                                        control={control}
                                        name="password"
                                        rules={{
                                            required: true,
                                            minLength: {
                                                value: 9,
                                                message: "Пароль должен содержать минимум 9 символов"
                                            },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/,
                                                message: "Пароль должен содержать хотя бы одну СТРОЧНУЮ букву, одну прописную, "
                                                    + " хотя бы одну цифру и один специальный символ [!#$%^&*]"
                                            },
                                        }}
                                        defaultValue="">

                                    </Controller>

                                    <ErrorMessage
                                        errors={errors}
                                        name="password"
                                        render={({messages}) => {
                                            return messages
                                                ? Object.entries(messages).map(([type, message]) => (
                                                    <Typography
                                                        paragraph={true}
                                                        style={{color: 'red'}}
                                                        key={type}>{message}</Typography>
                                                ))
                                                : null;
                                        }}
                                    />
                                </Box>
                                <Button type='submit' className={'loginButton'}
                                        disabled={!formState.isValid}>
                                    <Typography
                                        className={'loginButtonText '}>
                                        Зарегистрироваться
                                    </Typography>
                                </Button>
                                <Typography paragraph={true} className={'notRegisteredYet'}>
                                    Уже зарегистрированы? <Link to='/student-login'>Войти</Link>
                                </Typography>
                            </Container>
                        </form>
                    </Container>

                </Container>
                <Container className={'circlesContainer'}>
                    <Container className={'upperCircles'}>
                        <Container className={'blueCircle'}/>
                        <Container>
                            <Container className={'wiseStudentQuote'}>«Учитесь так, словно вы постоянно ощущаете
                                нехватку
                                своих знаний, и так, словно вы постоянно боитесь растерять свои знания.»</Container>
                            <Container>Конфуций</Container>
                        </Container>


                        <Container className={'purpleCircle'}/>
                    </Container>
                    <Container className={'pinkCircle'}>

                    </Container>
                </Container>
            </Container>

        </Fragment>

    );
}


Register.propTypes = {
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {register})(Register);