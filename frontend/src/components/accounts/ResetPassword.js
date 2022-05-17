import React, {Fragment} from 'react'
import PropTypes from 'prop-types';
import {useForm, Controller} from 'react-hook-form';
import {connect} from 'react-redux'

import {ErrorMessage} from "@hookform/error-message";

import Button from '@material-ui/core/Button';
import {Box, Container, Icon, InputAdornment, Typography} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import {resetPasswordEmailLink} from '../../actions/auth';
import {useStyles} from './../../App';
import {EMAIL_TEXTFIELD_VALIDATOR, REQUIRED_FIELD} from '../../helpers/requiredConst';
import {Link} from "react-router-dom";


export function ResetPassword(props) {

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

    const sendResetPasswordEmail = () => {
        props.resetPasswordEmailLink(email)
    }

    const styles = useStyles();

    return (
        <Fragment>
            <Container className='mentorLogin'>
                <div>
                    <Typography className='mentorLoginLabel'>Сброс пароля</Typography>
                        <Box>

                            <Typography className='loginLabelText'>Адрес электронной почты</Typography>
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
                        <Button
                            type="submit"
                            className='loginButton'
                            onClick={handleSubmit(sendResetPasswordEmail)}
                            disabled={!formState.isValid}
                        >
                            <Typography
                                className={'loginButtonText '}>
                                Отправить письмо для сброса пароля
                            </Typography>
                        </Button>
                </div>
            </Container>
        </Fragment>
    )
}

ResetPassword.propTypes = {
    resetPasswordEmailLink: PropTypes.func.isRequired,
}

export default connect(null, {resetPasswordEmailLink})(ResetPassword);