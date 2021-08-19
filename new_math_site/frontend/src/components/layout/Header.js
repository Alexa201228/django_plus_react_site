import React, { Fragment } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { NavLink, useLocation } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Container } from '@material-ui/core';

 const useStyles = makeStyles((theme) => ({
	appBar: {
		borderBottom: `1px solid ${theme.palette.divider}`,
	},
	link: {
		margin: theme.spacing(1, 1.5),
	},
	toolbarTitle: {
		flexGrow: 1,
	},
	headerContainer: {
		display: 'flex',
		alignItems: 'center',
		flexWrap: 'wrap',
		[theme.breakpoints.down('xs')]:{
			flexDirection: 'column',
		},
	},
	buttonContainer: {
		width: '30%',
		display: 'flex',
		alignItems: 'center',
		justifyContent:'flex-end',
		[theme.breakpoints.down('xs')]:{
			paddingRight: '0px',
			marginLeft: 'auto',
			marginRight: 'auto',
			flexWrap: 'wrap',
			order: 2,
		},
	},
	labelContainer:{
		width: '70%',
		[theme.breakpoints.down('xs')]:{
			textAlign: 'center',
			width: '100%',
		},
	},
	toolbar: theme.mixins.toolbar,
 }));


export function Header(props) {

	const { isAuthenticated, user } = props.auth;
	const classes = useStyles();

	//Use react hook useLocation to stay on the same
	//page after logout
	const location = useLocation();

	//Header in case authenticated user
	const authLinks = (
		<Fragment>
			<Box
				p={1}>
			<Button
				href=""
				color="primary"
				variant="outlined"
				component={NavLink}
				to={`${location}`}
				onClick={props.logout}
				>
				Logout
			</Button>
			</Box>
			<Box
				p={1}>
			{user && 
				<Button
					href=""
					color="primary"
					variant="outlined"
					component={NavLink}
					to={`/profile/${user.id}`}
				>
					Profile
				</Button>
			}
			</Box>
			

		</Fragment>
				
	);
	
	//Header if use is not authenticated
	const guessLinks = (
		<Fragment>
			<Box
				p={1}>
				<Button
					color="primary"
					href="#"
					variant="outlined"
					className={classes.link}
					component={NavLink}
					to="/register"
					>
					Register
				</Button>
			</Box>
				<Box
					p={1}>
					<Button
						href=""
						color="primary"
						variant="outlined"
						className={classes.link}
						component={NavLink}
						to="/login"
					>
					Login
					</Button>
				</Box>	
		</Fragment>			
	);

	return (
		<Fragment>	
			<CssBaseline />
				<AppBar
					position="static"
					color="default"
					elevation={0}
					className={classes.appBar}
				>
				<Toolbar className={classes.toolbar}>
					<Container className={classes.headerContainer}>
						<Container className={classes.labelContainer}>
								<Typography
								variant="h6"
								color="inherit"
								noWrap
								>
								<Link
									component={NavLink}
									to="/"
									underline="none"
									color="textPrimary"
								>
								Mathematiks
								</Link>
								</Typography>
							</Container>
						<Container className={classes.buttonContainer}>
							{isAuthenticated ? authLinks : guessLinks }
						</Container>
					</Container>		
				</Toolbar>
			</AppBar>
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