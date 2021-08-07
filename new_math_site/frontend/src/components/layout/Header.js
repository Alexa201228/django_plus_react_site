import React, { Fragment } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { NavLink, Redirect, useLocation } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';


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
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	buttonContainer: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
	}
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
			<Typography
				variant="h6"
				color="inherit">
				{ user ? `Welcome ${user.first_name}` : ""}
			</Typography>
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

		</Fragment>
				
	);
	
	//Header if use is not authenticated
	const guessLinks = (
		<Fragment>
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
						<Container>
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
					
						<Container className={classes.buttonContainer} display={{ xs: 'none'}}>
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