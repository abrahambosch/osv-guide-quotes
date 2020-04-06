import React from 'react';
import LoginForm from "./LoginForm";

class LoginButton extends React.Component {
    state = { showForm: false};
    toggle = (e) => {
        e.preventDefault();
        this.setState({showForm: !this.state.showForm});
    }
    render() {
        let className = ' ' + (this.state.showForm?"":"hidden");
        return <div className="osv-login-button-wrapper">
            <button className="osv-login-button btn btn-primary" onClick={this.toggle}>Login/Logout</button>
            <div className={className}>
                <div className="osv-login-button-form">
                    <LoginForm />
                </div>
            </div>
        </div>
    }
}

export default LoginButton;