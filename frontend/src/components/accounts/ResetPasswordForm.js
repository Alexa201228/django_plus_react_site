import React, {Fragment, useEffect} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import {useForm, Controller} from 'react-hook-form';
import PropTypes from 'prop-types';

import {getResetPasswordForm, resetPasswordEmailLink, setNewPassword} from '../../actions/auth';
import {useStyles} from './../../App';
import {Container, makeStyles, Typography} from '@material-ui/core';
import {ErrorMessage} from "@hookform/error-message";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import {EMAIL_TEXTFIELD_VALIDATOR, REQUIRED_FIELD} from '../../helpers/requiredConst';



export function ResetPasswordForm(props) {

    const dispatch = useDispatch();

    const {user} = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(getResetPasswordForm(props.match.params.token))
    }, [])
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
    const email = watch('email');
    const new_password = watch('new_password')
    const confirm_password = watch('confirm_password')

    const resendPasswordResetLink = () => {
        props.resetPasswordEmailLink(email)
    }
    const changeUserPassword = () => {
        const email = user.email;

        const userDataWithNewPassword = {
            email,
            new_password,
            confirm_password
        };
        props.setNewPassword(userDataWithNewPassword);
        window.history.push('/login')
    }

    //Если пользователь найден и ссылка
    //для сброса пароля активна
    const resetPasswordForm = (
        <form>
            <div className={'mentorLogin'}>
                <Box>
                    <Typography paragraph={true}>
                        {user && `${user.first_name}, введите новый пароль`}
                    </Typography>
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

                <Box my={2}>
                    <Typography className='loginLabelText'>Повторите пароль</Typography>
                    <Controller
                        render={({field}) =>
                            <TextField
                                {...field}
                                className='loginRegisterInput'
                                fullWidth
                                variant="standard"
                                placeholder={'Повторите пароль'}
                                type="Password"/>}
                        control={control}
                        name="confirm_password"
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
                        name="confirm_password"
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
                <Button className={'loginButton'}
                        disabled={!formState.isValid}
                        onClick={handleSubmit(changeUserPassword)}>
                    <Typography paragraph={true} className={'loginButtonText '}>
                        Изменить пароль
                    </Typography>

                </Button>
            </div>
        </form>
    );

    //Если ссылка неактивна,
    //отправляем email для сброса пароля повторно
    const sendResetEmailAgain = (
        <Container>
            <Typography paragraph={true}>
                Извините, ссылка для сброса пароля
                недействительна. Пожалуйста, введите адрес электронной
                почты для получения новой ссылки
            </Typography>
            <Box my={2}>
                <Controller
                    render={({field}) =>
                        <TextField
                            {...field}
                            fullWidth
                            variant="filled"
                            label="Email"
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
                            message: EMAIL_TEXTFIELD_VALIDATOR
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
            <Container>
                <Button
                    onClick={handleSubmit(resendPasswordResetLink)}
                    disabled={!formState.isValid}>
                    Отправить письмо повторно
                </Button>
            </Container>
        </Container>
    );

    return (
        <Fragment>
            <Container>
                {user ? resetPasswordForm : sendResetEmailAgain}
            </Container>
        </Fragment>
    )
}

ResetPasswordForm.propTypes = {
    getResetPasswordForm: PropTypes.func.isRequired,
    resetPasswordEmailLink: PropTypes.func.isRequired,
    setNewPassword: PropTypes.func.isRequired,
}

export default connect(null, {getResetPasswordForm, resetPasswordEmailLink, setNewPassword})(ResetPasswordForm);