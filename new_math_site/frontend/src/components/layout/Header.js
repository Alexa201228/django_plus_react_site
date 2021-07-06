import React, {Component, Fragment} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
 import { logout } from '../../actions/auth';



export class Header extends Component {
	static propTypes = {
		auth: PropTypes.object.isRequired,
		logout: PropTypes.func.isRequired
	}

	render() {
		const { isAuthenticated, user } = this.props.auth;

		const authLinks = (
			<Fragment>
				<Button
					href="#"
					color="primary"
					variant="outlined"
					component={NavLink}
					to="/logout"
					onClick={this.props.logout}
					>
					Logout
				</Button>
			</Fragment>
				
		);

		const guessLinks = (
			<Fragment>
				<Link
					color="textPrimary"
					href="#"
					component={NavLink}
					to="/register"
				>
					Register
				</Link>

				<Button
					href="#"
					color="primary"
					variant="outlined"
					component={NavLink}
					to="/login"
				>
					Login
				</Button>
			</Fragment>
				
		);

		return (
			<Fragment>
				<nav className="navbar navbar-expand-sm">
					<CssBaseline />
				<AppBar
					position="static"
					color="default"
					elevation={0}

				>
					<Toolbar >
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
						{isAuthenticated ? authLinks : guessLinks }

					</Toolbar>
				</AppBar>
				</nav>
				
			</Fragment>
		);
	}
}
	


const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps, {logout})(Header);