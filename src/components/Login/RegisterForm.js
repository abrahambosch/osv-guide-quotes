import React from 'react'
import { Form, Field } from 'react-final-form'
import { createUser, attemptLogout } from '../../actions'
import { connect } from 'react-redux';

class RegisterForm extends React.Component {
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
            return <div className="ui error message red">
                {error}
            </div>
        }
    }

    onSubmit = (formValues) => {
        console.log("LoginForm formValues", formValues);
        this.props.createUser(
            formValues.first_name,
            formValues.last_name,
            formValues.phone,
            formValues.email,
            formValues.password
        );
    };

    render() {
        if (!this.props.auth.user) {
            return this.renderForm();
        }
        let logout_url = this.props.auth.logout_url;
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
                            <legend>Signup</legend>
                            {loginErrors}
                            <div className="row">
                                <div className="col-md-6">
                                    <Field name="first_name">
                                        {({input, meta}) => (
                                            <div className="form-group">
                                                <label>First Name</label>
                                                <input {...input} type="text" placeholder="First Name" className="form-control"/>
                                                {(meta.error || meta.submitError) && meta.touched && (
                                                    <div className="red">{meta.error || meta.submitError}</div>
                                                )}
                                            </div>
                                        )}
                                    </Field>
                                </div>
                                <div className="col-md-6">
                                    <Field name="last_name">
                                        {({input, meta}) => (
                                            <div className="form-group">
                                                <label>Last Name</label>
                                                <input {...input} type="text" placeholder="Last Name" className="form-control"/>
                                                {(meta.error || meta.submitError) && meta.touched && (
                                                    <div className="red">{meta.error || meta.submitError}</div>
                                                )}
                                            </div>
                                        )}
                                    </Field>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <Field name="phone">
                                        {({input, meta}) => (
                                            <div className="form-group">
                                                <label>UK Phone</label>
                                                <input {...input} type="text" placeholder="UK Phone" className="form-control"/>
                                                {(meta.error || meta.submitError) && meta.touched && (
                                                    <div className="red">{meta.error || meta.submitError}</div>
                                                )}
                                            </div>
                                        )}
                                    </Field>
                                </div>
                                <div className="col-md-6">
                                    <Field name="email">
                                        {({input, meta}) => (
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input {...input} type="text" placeholder="Email" className="form-control"/>
                                                {(meta.error || meta.submitError) && meta.touched && (
                                                    <div className="red">{meta.error || meta.submitError}</div>
                                                )}
                                            </div>
                                        )}
                                    </Field>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <Field name="password">
                                        {({input, meta}) => (
                                            <div className="form-group">
                                                <label>Password</label>
                                                <input {...input} type="password" placeholder="Password" className="form-control"/>
                                                {meta.error && meta.touched && <div className="red">{meta.error}</div>}
                                            </div>
                                        )}
                                    </Field>
                                </div>
                                <div className="col-md-6">
                                    <Field name="passwordverify">
                                        {({input, meta}) => (
                                            <div className="form-group">
                                                <label>Password Verify</label>
                                                <input {...input} type="password" placeholder="Enter the same password again" className="form-control"/>
                                                {meta.error && meta.touched && <div className="red">{meta.error}</div>}
                                            </div>
                                        )}
                                    </Field>
                                </div>
                            </div>
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
    if (!formValues.first_name) {
        errors.first_name = "You must enter your first name. ";
    }
    if (!formValues.last_name) {
        errors.last_name = "You must enter your last name. ";
    }
    if (!formValues.phone) {
        errors.phone = "You must enter your phone number. ";
    }
    if (!formValues.email) {
        errors.email = "You must enter an email. ";
    }
    if (!formValues.password) {
        errors.password = "You must enter a password. ";
    }
    if (!formValues.passwordverify) {
        errors.passwordverify = "You must verify your password. ";
    }
    if (formValues.passwordverify !== formValues.password) {
        errors.password = "The passwords must match";
        errors.passwordverify = "The passwords must match";
    }

    return errors;
};


const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}


export default connect(mapStateToProps, {
    createUser, attemptLogout
})(RegisterForm);
