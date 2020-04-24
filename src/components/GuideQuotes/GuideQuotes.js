import React from 'react';
import {Form, Field} from 'react-final-form';
import axios from 'axios';
import GuideQuotesPrice from "./GuideQuotesPrice";
import { connect } from 'react-redux';
import _ from 'lodash';

//import Modal from 'react-modal';


let api_url = "https://api.osv.ltd.uk";
if (window.location.hostname === 'localhost' || window.location.hostname === 'staging.osv.ltd.uk') {
    api_url = "https://staging-api.osv.ltd.uk";
}

function formatErrors(obj) {
    let items = [];
    let i = 0;
    if (typeof obj === 'string') obj = {error: obj};
    for (const n in obj) {
        let v = arrayToString(obj[n]);
        items.push(<div key={i}><b>{n}:</b> {v}</div>);
        i++;
    }
    return <div>{items}</div>;
}

function arrayToString(arr) {
    if (typeof arr === 'string') return arr;
    if (arr instanceof Array) return arr[0];
    return JSON.stringify(arr);
}


function getErrorFromAxiosError(error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        if (typeof error.response.data === 'object') return error.response.data;
        else {
            return error.message;
        }
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        return error.message;
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        return error.message;
    }
}


class GuideQuotes extends React.Component {
    state = {
        api_url: this.props.api_url?this.props.api_url:api_url,
        errors: [],
        name: this.props.user?this.props.user.first_name + " " + this.props.user.last_name:"",
        email: this.props.user?this.props.user.user_email:"",
        phone: this.props.user?this.props.user.phone:"",
        consent: "",
        seomake: this.props.seomake,
        seomodel: this.props.seomodel,
        showSuccess: false,
        rateBook: null,
        callbackRequest: null,
        garageItems: [],
    };



    reportError = (error) => {
        error = getErrorFromAxiosError(error);
        this.setState((state, props) => {
            let errors = [...state.errors, error];
            return {errors};
        });
    }

    removeError = (i) => {
        console.log("removing error: ", i);
        let errors = this.state.errors.filter((item, j) => {
            if (i!=j) return true;
            return false;
        });
        this.setState({errors});
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
            return <div className="ui error message">
                {error}
            </div>
        }
    }

    onSubmit = (formValues) => {
        console.log("onSubmit: ", formValues);
        let { name, phone, email, consent } = formValues;
        let { seomake, seomodel } = this.state;
        phone = phone.replace(/[^0-9]/g, "");
        this.setState({ name, phone, email, consent });

        let data = {name, phone, email, consent, seomake, seomodel};
        console.log("submitting quote: ", data);
        axios.post(this.state.api_url + '/quotes', data).then((response) => {
            console.log(response);
            if (response.data.data.rateBook) {
                this.setState({rateBook: response.data.data.rateBook})
            }
            if (response.data.data.callbackRequest) {
                this.setState({callbackRequest: response.data.data.callbackRequest})
            }
        }).catch((error) => {
            console.log(error);
            this.reportError(error);
        });
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        })
    }


    componentDidUpdate(prevProps) {
        if (this.props.user !== prevProps.user) {
            if (!this.state.name && !this.state.email) {
                this.setState({
                    name: this.props.user.first_name + " " + this.props.user.last_name,
                    email: this.props.user.user_email,
                    phone: this.props.user.phone
                })
            }
        }
    }


    render() {
        let errors = this.state.errors.map((item, i) => {
            item = formatErrors(item);
            //if (typeof item === 'object') item = JSON.stringify(item);
            return (<div key={i} className={"alert alert-danger alert-dismissible"} role="alert" onClick={()=> {this.removeError(i)}}>{item}</div> );
        });

        let {rateBook, callbackRequest} = this.state;
        if (rateBook) {
            /*
            id: 2947
            book_type: "BOOK"
            rate_book_upload_id: 1
            cder_ID: 86449
            name: "Honda Honda CR-V 5 Door 1.5 VTEC S 2WD"
            monthly_price: "360.56"
            initial_payment: "5000.00"
            contract_length: 0
            contract_term: "24"
            mileage: 10000
            expiration: "2020-06-17"
            active: 1
            rank: 100
            created_at: "2020-03-19 00:18:20"
            updated_at: "2020-03-19 00:18:20"
            cder_mancode: 4256
            cder_rancode: 216
            cder_modcode: 92086
             */

            function nf(n) {
                n = Math.floor(n);
                n = n.toLocaleString();
                return n;
            }

            return (
                <GuideQuotesPrice
                    name={this.state.name}
                    email={this.state.email}
                    phone={this.state.phone}
                    rateBook={this.state.rateBook}
                    garageItems={this.state.garageItems}
                ></GuideQuotesPrice>
            );
        }
        else if (callbackRequest) {
            return (
                <div className="request-guide-price">
                    <h2>Want this car at a great price?</h2>
                    <p> We’ll find you a great price to buy, lease or finance this vehicle. </p>
                    <h3 className="text-center"><span className="glyphicon glyphicon-ok" aria-hidden="true"></span> Request Received. </h3>
                    A team member will be in contact with you.
                </div>
            );
        }
        else {
            return (
                <div className="request-guide-price">
                    <h2>Want this car at a great price?</h2>
                    <p>Submit your details below for our pricing information. </p>
                    {errors}
                    <Form
                        onSubmit={this.onSubmit} validate={validate}
                        render={({submitError, handleSubmit, form, submitting, pristine, values}) => (
                            <form id="login" action="login" method="post" onSubmit={handleSubmit}>
                        <div>
                            <Field name="name">
                                {({input, meta}) => (
                                    <div className="form-group">
                                        <input {...input} type="text" placeholder="Name" className="form-control"/>
                                        {(meta.error || meta.submitError) && meta.touched && (
                                            <div className="red">{meta.error || meta.submitError}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div>
                            <Field name="phone">
                                {({input, meta}) => (
                                    <div className="form-group">
                                        <input {...input} type="phone" placeholder="UK Phone Number" className="form-control"/>
                                        {(meta.error || meta.submitError) && meta.touched && (
                                            <div className="red">{meta.error || meta.submitError}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div>
                            <Field name="email">
                                {({input, meta}) => (
                                    <div className="form-group">
                                        <input {...input} type="email" placeholder="Email" className="form-control"/>
                                        {(meta.error || meta.submitError) && meta.touched && (
                                            <div className="red">{meta.error || meta.submitError}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <Field name="uk_confirmation">
                            {({input, meta}) => (
                                <div className="request-guide-price-consent">
                                    <label><input {...input} type="checkbox" required="required"/> I am in the UK. </label>
                                    {(meta.error || meta.submitError) && meta.touched && (
                                        <div className="red">{meta.error || meta.submitError}</div>
                                    )}
                                </div>
                            )}
                        </Field>
                        <Field name="consent">
                            {({input, meta}) => (
                                <div className="request-guide-price-consent">
                                    <label><input {...input} type="checkbox" /> Consent<span> * </span> &nbsp; </label>
                                    <span>By ticking this box you are agreeing that OSV Ltd can store and process the data that you have entered.</span>
                                    {(meta.error || meta.submitError) && meta.touched && (
                                        <div className="red">{meta.error || meta.submitError}</div>
                                    )}
                                </div>
                            )}
                        </Field>
                        <div>
                            <div className="form-group">
                                <input type="submit" className="btn" value="Request price information"/>
                            </div>
                            {submitError && <div className="error">{submitError}</div>}
                        </div>
                    </form> )} />
                </div>
            );
        }
    }
}

const validate = values => {
  let errors = {};
  if (!values.name) {
      errors.name = "Please enter your name. ";
  }
    if (!values.phone) {
        errors.phone = "Please enter your phone. ";
    }
    else if (values.phone.toString()[0] != '0') {
        errors.phone = "Must be a valid UK phone number. ";
    }
    else if (values.phone.length !== 11) {
        errors.phone = "Must be a valid UK phone number. ";
    }
    if (!values.email) {
        errors.email = "Please enter your email. ";
    }
    if (!values.consent) {
        errors.consent = "Please check the box to confirm consent. ";
    }
    return errors;
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        user: state.auth && state.auth.user,
        callbackRequests: state.callbackRequests,
        garageGuideQuotes: state.garageGuideQuotes
    }
}

export default connect(mapStateToProps, {})(GuideQuotes);
