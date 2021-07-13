import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withAlert } from 'react-alert';
import PropTypes from 'prop-types'


export class Alerts extends Component {
    
    static propTypes = {
        error: PropTypes.object.isRequired,
        message: PropTypes.object.isRequired
    }

    componentDidUpdate(prevProps) {
        const { error, message, alert } = this.props;
        if (error !== prevProps.error) {
            Object.entries(error.msg).forEach(([key,element]) => {
                Object.entries(element).forEach(([key, err]) => {                   
                    alert.error(err);
                });
            });
        }

        if (message !== prevProps.message) {
            Object.entries(message).forEach(([key, element]) => {
                alert.success(element);
            });
        }
    }
    render() {
        return <Fragment />;
    }
}

const mapStateToProps = (state) => ({
    error: state.errors,
    message: state.messages
});

export default connect(mapStateToProps)(withAlert()(Alerts));