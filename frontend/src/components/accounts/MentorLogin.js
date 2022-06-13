import React, {useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {connect, useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {FormControl, Icon, InputAdornment, Typography} from '@material-ui/core';

import {mentorLogin} from '../../actions/auth';
import './../../styles/registerLoginForms.css'


export function MentorLogin(props) {

    const [userCredentials, setUserCredentials] = useState({
        email: '',
        password: '',
    })

    const {user} = useSelector(state => state.auth);

    const onSubmit = (e) => {
        e.preventDefault();
        props.mentorLogin(userCredentials.email, userCredentials.password);
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
                    <Typography className='mentorLoginLabel'>Вход для преподавателей</Typography>
                    <form onSubmit={onSubmit}>
                        <Box>

                            <Typography className='loginLabelText'>Адрес электронной почты</Typography>
                            <TextField
                                autoComplete="email"
                                className='loginRegisterInput'
                                type="email"
                                name="email"
                                placeholder='Введите адрес электронной почты'
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Icon
                                        className={'inputIconEmailContainer'}/></InputAdornment>,
                                }}
                                onChange={onChange}
                                value={userCredentials.email}
                                autoFocus
                                variant={'standard'}
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
                            <Typography paragraph={true}>
                                <Link to='/reset-password' className={'forgotPasswordLink'}>Забыли пароль?</Link>
                            </Typography>
                        </Box>
                        <Button
                            type="submit"
                            className='loginButton'
                        >
                            <Typography
                                className={'loginButtonText '}>
                                Войти
                            </Typography>
                        </Button>
                        <Typography
                            className={'iAmStudentTextLabel'}>
                            <Link
                                to={'/student-login'}>
                                Я обучающийся
                            </Link>
                        </Typography>
                    </form>
                </div>
            </Container>
            <Container className={'circlesContainer'}>
                <Container className={'upperCircles'}>
                    <Container className={'blueCircle'}/>
                    <Container>
                        <Container className={'wiseQuote'}>«Обучать - значит вдвойне учиться.»</Container>
                        <Container>Жозеф Жубер</Container>
                    </Container>


                    <Container className={'purpleCircle'}/>
                </Container>
                <Container className={'pinkCircle'}>

                </Container>
            </Container>
        </Container>
    );
}

MentorLogin.propTypes = {
    mentorLogin: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {mentorLogin})(MentorLogin);