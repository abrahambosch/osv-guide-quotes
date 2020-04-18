import React from 'react'
import { Form, Field } from 'react-final-form'
import { updateUser, attemptLogout } from '../../actions'
import { connect } from 'react-redux';

class GarageAccountForm extends React.Component {
    state = {
        showPasswordFields: false
    }
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
        if (this.props.auth.user) {
            return this.renderForm();
        }
        else {
            return null;
        }
    }

    renderForm = () => {
        let loginErrors = null;
        if (this.props.auth.loginErrors) {
            loginErrors = <div className="alert alert-danger" role="alert">{this.props.auth.loginErrors}</div>;
        }

        const { first_name, last_name, user_email, phone } = this.props.auth.user;

        return <div className="osv-register-form">
            <Form
                initialValues={ {first_name, last_name, email: user_email, phone} }
                onSubmit={this.onSubmit}
                validate={validate}
                render={({submitError, handleSubmit, form, submitting, pristine, values}) => (
                    <form id="login" action="login" method="post" onSubmit={handleSubmit}>
                        <fieldset>
                            <legend>Garage Account</legend>
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
                                    <Field name="special_offers_email">
                                        {({input, meta}) => (
                                            <div className="form-group">
                                                <label>
                                                    <input {...input} type="checkbox"/>
                                                    Subscribe to special offers email</label>
                                                {(meta.error || meta.submitError) && meta.touched && (
                                                    <div className="red">{meta.error || meta.submitError}</div>
                                                )}
                                            </div>
                                        )}
                                    </Field>
                                </div>
                            </div>
                            <Field name="changePassword">
                                {({input, meta}) => (
                                    <div><input {...input} type="checkbox" onClick={e=>this.setState({showPasswordFields: e.target.checked})}/> Click here to change your password. </div>
                                )}
                            </Field>
                            {this.state.showPasswordFields && (
                            <div className="row">
                                <div className="col-md-6">
                                    <Field name="password">
                                        {({input, meta}) => (
                                            <div className="form-group">
                                                <label>Change Password</label>
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
                                                <label>Change Password Verify</label>
                                                <input {...input} type="password" placeholder="Enter the same password again" className="form-control"/>
                                                {meta.error && meta.touched && <div className="red">{meta.error}</div>}
                                            </div>
                                        )}
                                    </Field>
                                </div>
                            </div>
                            )}
                            {submitError && <div className="error">{submitError}</div>}

                            <div>
                                <input className="btn btn-primary" type="submit" value="Save" name="submit"/>
                            </div>
                            <div>
                                <br />
                                <a href="/gdpr" target="_blank">GDPR agreement and E-privacy</a>
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
    if (formValues.changePassword) {
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
    }

    return errors;
};


const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}


export default connect(mapStateToProps, {
    updateUser, attemptLogout
})(GarageAccountForm);
