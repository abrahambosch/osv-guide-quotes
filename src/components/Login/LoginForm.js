import React from 'react'
import {Form, Field} from 'react-final-form'
import {attemptLogin, attemptLogout} from '../../actions'
import {connect} from 'react-redux';

class LoginForm extends React.Component {
    renderInput = (formProps) => {
        console.log("LoginForm renderInput formProps", formProps);
        let errorMessage = null;
        const className = `form-group ${formProps.meta.error && formProps.meta.touched ? 'error' : ''}`;
        return (
            <div className={className}>
                <label>{formProps.label}</label>
                <input {...formProps.input} className="form-control" placeholder={formProps.label}
                       type={formProps.type}/>
                {this.renderError(formProps.meta)}
            </div>
        );
    }

    renderError({error, touched}) {
        if (touched && error) {
            return <div className="ui error message">
                {error}
            </div>
        }
    }

    onSubmit = (formValues) => {
        console.log("LoginForm formValues", formValues);
        this.props.attemptLogin(formValues.username, formValues.password);
    }

    render() {
        if (!this.props.auth.user) {
            return this.renderForm();
        }
        let logout_url = this.props.auth.logout_url;
        //let btn = <button onClick={this.props.attemptLogout} className="btn btn-primary">Logout</button>;
        let btn = <a href={logout_url} onClick={e => {
            e.preventDefault();
            this.props.attemptLogout();
        }} className="btn btn-primary">Logout</a>;
        return (
            <div>
                Hi, {this.props.auth.user.display_name}. <br />
                You are logged in. <br />
                {btn}
            </div>
        );
    }

    renderForm = () => {
        let loginErrors = null;
        if (this.props.auth.loginErrors) {
            loginErrors = <div className="alert alert-danger" role="alert">{this.props.auth.loginErrors}</div>;
        }

        return <div>
            <Form
                onSubmit={this.onSubmit} validate={validate}
                render={({submitError, handleSubmit, form, submitting, pristine, values}) => (
                    <form id="login" action="login" method="post" onSubmit={handleSubmit}>
                        <fieldset>
                            <legend>Site Login</legend>
                            {loginErrors}
                            <Field name="username">
                                {({input, meta}) => (
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input {...input} type="text" placeholder="Username" className="form-control"/>
                                        {(meta.error || meta.submitError) && meta.touched && (
                                            <div className="red">{meta.error || meta.submitError}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                            <Field name="password">
                                {({input, meta}) => (
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input {...input} type="password" placeholder="Password" className="form-control"/>
                                        {meta.error && meta.touched && <div>{meta.error}</div>}
                                    </div>
                                )}
                            </Field>
                            {submitError && <div className="error">{submitError}</div>}
                            <a className="lost" href={this.props.auth.lost_password_url}>Lost your password?</a>
                            <div>
                                <input className="btn btn-primary" type="submit" value="Login" name="submit"/>
                            </div>
                            {this.props.debug && <div>
                                <pre>{JSON.stringify(values, 0, 2)}</pre>
                                <pre>{JSON.stringify(this.props.auth, 0, 2)}</pre>
                            </div>}
                        </fieldset>
                    </form>)}
            />
        </div>;
    }
}

const validate = (formValues) => {
    let errors = {};
    if (!formValues.username) {
        errors.username = "You must enter a username. ";
    }
    if (!formValues.password) {
        errors.password = "You must enter a password. ";
    }
    return errors;
};


const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}


export default connect(mapStateToProps, {
    attemptLogin, attemptLogout
})(LoginForm);
