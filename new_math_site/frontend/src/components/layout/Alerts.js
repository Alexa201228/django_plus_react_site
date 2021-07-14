import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withAlert } from 'react-alert';
import PropTypes from 'prop-types'


const getAlerts = (obj) => {
    for (var key in obj) {
        if (typeof (obj[key]) === 'object') {
            getAlerts(obj[key])
        }
        else
        {
            alerts.push(obj[key])
        }
    }
};

const showAlerts = (func) => {
    for (var key in alerts) {
        func(alerts[key]);

    }
    alerts.length = 0;
}

const alerts = [];

export class Alerts extends Component {
    
    static propTypes = {
        error: PropTypes.object.isRequired,
        message: PropTypes.object.isRequired
    }


    componentDidUpdate(prevProps) {
        const { error, message, alert } = this.props;
        if (error !== prevProps.error) {
            getAlerts(error.msg);
            showAlerts(alert.error);
        }

        if (message !== prevProps.message) {
            getAlerts(message);
            showAlerts(alert.success);
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