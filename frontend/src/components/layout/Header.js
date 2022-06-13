import React, {Fragment} from 'react';
import {NavLink} from 'react-router-dom';
import {connect, useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import {Box, Container, Icon} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import {logout} from '../../actions/auth';
import './../../styles/header.css';


const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    link: {
        background: '#E7D9EA',
        margin: '10px',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    headerContainer: {
        margin: '10px 0 0 0',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
    buttonContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        [theme.breakpoints.down('xs')]: {
            paddingRight: '0px',
            marginLeft: '10px',
            marginRight: 'auto',
            flexWrap: 'wrap',
            order: 2,
        },
    },
    labelContainer: {
        justifyContent: 'space-around',
        paddingLeft: 0,
        [theme.breakpoints.down('xs')]: {
            textAlign: 'center',
            width: '100%',
            textWrap: 'wrap'
        },
    },
    headerTextImageContainer: {
        display: "flex"
    },
    labelTextTypography: {
        marginRight: '20px',
        marginLeft: '20px',
    },
    toolbar: theme.mixins.toolbar,
}));

function ScrollTop(props) {
    const {children} = props;
    const classes = useStyles();
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 120,
    });

    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

        if (anchor) {
            anchor.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    };

    return (
        <Zoom in={trigger}>
            <div onClick={handleClick} role="presentation" className={classes.root}>
                {children}
            </div>
        </Zoom>
    );
}

ScrollTop.propTypes = {
    children: PropTypes.element.isRequired,
};


export function Header(props) {

    const {isAuthenticated, user, isMentor} = useSelector((state) => state.auth);

    //Header in case authenticated user
    const authLinks = (
        <Fragment>

            <Box
                px={1}>
                {user &&
                <Button>
                    <Container
                        component={NavLink}
                        to={`/user/profile/${user.id}`}
                        className={'headerProfileInfo'}>
                        <Container className={'studentIcon'} >
                        </Container>
                        <Container>
                            <Typography className={'personNames'}>
                                {user?.last_name} {user.first_name[0]}.
                            </Typography>
                            <Typography className={'personalHeaderInfo'}>
                                {isMentor ? 'преподаватель' : 'обучающийся' }
                            </Typography>
                        </Container>
                    </Container>
                </Button>
                }
            </Box>
            <Box>
                <Button className={'logoutButton'}>
                    <Icon component={NavLink} to={'/student-login'}
                          onClick={props.logout} className={'logoutIcon'}/>
                </Button>
            </Box>

        </Fragment>

    );

    return (
        <Fragment>
            <CssBaseline/>
            <AppBar
                position="fixed"
                color="default"
                elevation={0}
                className='header'
            >
                <Container>
                    <Container>
                        <Link
                            component={NavLink}
                            to="/"
                            underline="none"
                            color="textPrimary"
                        >
                            <Container>
                                <div className='uniLogo'/>
                                <Typography
                                    variant="h6"
                                    color="inherit"
                                    className='labelTextTypography'
                                >

                                    Информационная система по подготовке и тестированию обучающихся

                                </Typography>
                            </Container>
                        </Link>
                    </Container>
                    <Container className='headerButtonContainer'>
                        {isAuthenticated ? authLinks : null}
                    </Container>
                </Container>
            </AppBar>
            <Toolbar id="back-to-top-anchor"/>
            <ScrollTop {...props}>
                <Fab color="secondary" size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon/>
                </Fab>
            </ScrollTop>
        </Fragment>
    );
}

Header.propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, {logout})(Header);