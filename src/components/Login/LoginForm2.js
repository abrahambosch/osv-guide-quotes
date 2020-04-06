import React from 'react'
import { Field, reduxForm } from "redux-form";
import { attemptLogin } from '../../actions'

class LoginForm extends React.Component {

    renderInput = (formProps) => {
        console.log("LoginForm renderInput formProps", formProps);
        let errorMessage = null;
        const className = `form-group ${formProps.meta.error && formProps.meta.touched? 'error': ''}`;
        return (
            <div className={className}>
                <label>{formProps.label}</label>
                <input {...formProps.input} className="form-control" placeholder={formProps.label} type={formProps.type}/>
                {this.renderError(formProps.meta)}
            </div>
        );
    }

    renderError({ error, touched}) {
        if (touched && error) {
            return <div className="ui error message">
                {error}
            </div>
        }
    }

    onSubmit = (formValues, dispatch) => {
        console.log("LoginForm formValues", formValues);
        try {
            dispatch(attemptLogin(formValues.username, formValues.password));
        } catch (error) {
            console.log("got an error", error);
        }
    }

    onSubmitFail = (errors, dispatch) => {
        console.log("LoginForm onSubmitFail", errors);
    }

    render() {
        return <div>
            <form id="login" action="login" method="post" onSubmit={this.props.handleSubmit(this.onSubmit)} onSubmitFail={this.onSubmitFail}>
                <fieldset>
                    <legend>Site Login</legend>
                    <Field name="username" component={this.renderInput} label="Username" type="text"/>
                    <Field name="password" component={this.renderInput} label="Username" type="password"/>

                    <a className="lost" href="">Lost your password?</a>
                    <div>
                        <input className="btn btn-primary" type="submit" value="Login" name="submit"/>
                    </div>

                </fieldset>
            </form>
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




export default reduxForm({
    form: 'loginForm',
    validate
})(LoginForm);