import React, {useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {connect, useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Icon, InputAdornment, Typography} from '@material-ui/core';

import {studentLogin} from '../../actions/auth';
import './../../styles/registerLoginForms.css'


export function Login(props) {

    const [userCredentials, setUserCredentials] = useState({
        student_book_number: '',
        password: '',
    })
    const {user} = useSelector(state => state.auth);

    const onSubmit = (e) => {
        e.preventDefault();
        props.studentLogin(userCredentials.student_book_number, userCredentials.password);
    };

    const onChange = (e) => {
        setUserCredentials({...userCredentials, [e.target.name]: e.target.value})
    };


    if (props.isAuthenticated) {
        return <Navigate to={`/user/profile/${user?.id}`}/>;
    }

    return (
        <Container style={{display: "flex"}}>
            <Container className='mentorLogin'>
                <div>
                    <Typography className='mentorLoginLabel'>Вход для обучающихся</Typography>
                    <form onSubmit={onSubmit}>
                        <Box>
                            <Typography className='loginLabelText'>Номер зачетной книжки</Typography>
                            <TextField
                                className='loginRegisterInput'
                                name="student_book_number"
                                placeholder={'Введите номер зачетной книжки'}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Icon
                                        className={'inputIconStudentBookContainer'}/></InputAdornment>,
                                }}
                                onChange={onChange}
                                value={userCredentials.student_book_number}
                                variant={'standard'}
                                autoFocus
                            />
                        </Box>
                        <Box>
                            <Typography className='loginLabelText'>Пароль</Typography>
                            <TextField
                                autoComplete="current-password"
                                className='loginRegisterInput'
                                type="password"
                                name="password"
                                placeholder={'Введите пароль'}
                                InputProps={{
                                    startAdornment: <InputAdornment position={'start'}><Icon
                                        className={'inputIconPasswordContainer'}/> </InputAdornment>
                                }}
                                onChange={onChange}
                                value={userCredentials.password}
                                variant={'standard'}
                            />
                        </Box>
                        <Typography paragraph={true}>
                            <Link to='/reset-password' className={'forgotPasswordLink'}>Забыли пароль?</Link>
                        </Typography>
                        <Button
                            type="submit"
                            className={'loginButton'}
                        >
                            <Typography
                                className={'loginButtonText '}>
                                Войти
                            </Typography>
                        </Button>
                        <Typography paragraph={true} className={'notRegisteredYet'}>
                            Ещё не зарегистрированы? <Link to="/register">Зарегистрироваться</Link>
                        </Typography>
                        <Typography
                            className={'iAmStudentTextLabel'}>
                            <Link
                                to={'/mentor-login'}>
                                Я преподаватель
                            </Link>

                        </Typography>

                    </form>
                </div>

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


    );
}

Login.propTypes = {
    studentLogin: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {studentLogin})(Login);