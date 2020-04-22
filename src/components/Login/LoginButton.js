import React from 'react';
import LoginForm from "./LoginForm";
import {connect} from "react-redux";


class LoginButton extends React.Component {
    state = { showForm: false };
    toggle = (e) => {
        e.preventDefault();
        this.setState({showForm: !this.state.showForm});
    }
    render() {
        let className = ' ' + (this.state.showForm?"":"hidden");
        let txt = this.props.auth.user?"Garage Logout":"Garage Login";
        return <div className="osv-login-button-wrapper">
            <button className="osv-login-button btn btn-primary" onClick={this.toggle}>{txt}</button>
            <div className={className}>
                <div className="osv-login-button-form">
                    <LoginForm />
                </div>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}


export default connect(mapStateToProps, {

})(LoginButton);
