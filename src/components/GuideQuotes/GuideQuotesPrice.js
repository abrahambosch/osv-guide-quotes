import React from 'react';
import { connect } from 'react-redux';
import { createUser, createGarageItem, requestCallback, attemptLogin } from '../../actions';
import {Form, Field} from 'react-final-form';

let api_url = "https://api.osv.ltd.uk";
if (window.location.hostname === 'localhost' || window.location.hostname === 'staging.osv.ltd.uk') {
    api_url = "https://staging-api.osv.ltd.uk";
}

function formatErrors(obj) {
    let items = [];
    let i = 0;
    if (typeof obj === 'string') return obj;
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


class GuideQuotesPrice extends React.Component {
    state = {
        api_url: this.props.api_url ? this.props.api_url : api_url,
        errors: [],
        name: this.props.name,
        email: this.props.email,
        phone: this.props.phone,
        consent: "",
        seomake: this.props.seomake,
        seomodel: this.props.seomodel,
        password: "",
        passwordConfirm: "",
        saveToGarageButtonClicked: false,
        requestCallbackReceived: false,
        showPasswordForm: false,
        garageItem: null
    };

    reportError = (error) => {
        error = getErrorFromAxiosError(error);
        this.setState((state, props) => {
            let errors = [...state.errors, error];
            return {errors};
        });
    };

    removeError = (i) => {
        console.log("removing error: ", i);
        let errors = this.state.errors.filter((item, j) => {
            if (i != j) return true;
            return false;
        });
        this.setState({errors});
    };

    onSubmitLoginUser = (formValues) => {
        let { email, password } = formValues;
        this.setState({ email, password });
        this.props.attemptLogin(email, password, (error, user) => {
            if (error !== null) {
                console.error('got an error', error);
                this.setState({errors: [...this.state.errors, error]})
            }
            else if (user) {
               this.addToGarage(user);
            }
        });
    }
    onSubmitCreateUser = (formValues) => {
        console.log("onSubmit: ", this.state, formValues);
        //this.setState({selectedTab})
        let { name, phone, email } = this.state;
        let { password } = formValues;
        this.setState({password});
        let name_arr = name.split(" ").filter(item => item.length);
        let first_name = name_arr.shift();
        let last_name = name_arr.join(" ");

        phone = phone.replace(/[^0-9]/g, "");
        this.props.createUser(first_name, last_name, phone, email, password, (error, user) =>{
            console.log("created a user. ", user);
            if (error !== null) {
                console.error('got an error', error);
                this.setState({errors: [...this.state.errors, error]})
            }
            else if (user) {
                this.addToGarage(user);
            }
        });
    };


    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        })
    };

    onClickSaveToGarage = (e) => {
        e.preventDefault();
        if (this.props.user) {
            this.addToGarage(this.props.user);
        } else {
            this.setState({saveToGarageButtonClicked: true});
        }
    };

    addToGarage = (user) => {
        if (!user) user = this.props.user;
        let {seomake, seomodel} = this.state;
        let { rateBook} = this.props;
        let data = {user_id: user.user_id, seomake, seomodel, rateBookId: rateBook.id};
        console.log("submitting quote: ", data);
        this.props.createGarageItem(user.user_id, data.seomake, data.seomodel, data.rateBookId, (error, response) => {
            if (error) {
                this.reportError(error);
            }
            else {
                console.log(response);
                this.setState({saveToGarageButtonClicked: true});
            }
        });
    };

    requestOfficialQuote = () => {
        const { name, phone, email } = this.state;
        const rate_books_id = this.props.rateBook.id;
        this.props.requestCallback(name, phone, email, rate_books_id, (error, response) => {
            if (!error) {
                this.setState({requestCallbackReceived: true});
            }
        });
    }


    render() {
        let {user, rateBook} = this.props;

        let errors = this.state.errors.map((item, i) => {
            item = formatErrors(item);
            //if (typeof item === 'object') item = JSON.stringify(item);
            return (<div key={i} className={"alert alert-danger alert-dismissible"} role="alert" onClick={() => {
                this.removeError(i)
            }}>{item}</div>);
        });

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
        let titleTxt = "BCH = Business Contract Hire\n" +
            "PCH = Personal Contract Hire\n" +
            "BOL = Business Operating Lease\n" +
            "POL = Personal Operating Lease";
        return (
            <div className="guide-price">
                <div className="guide-price-box">
                    <h2>Prices from</h2>
                    <div className={"guide-price-price"}>
                        £{nf(rateBook.monthly_price)} + VAT per month *
                    </div>
                    <div className="guide-price-body">
                        Based on {nf(rateBook.mileage)} miles per year<br/>
                        £{nf(rateBook.initial_payment)} + VAT initial payment<br/>
                        {rateBook.contract_term} month contract *<br/>
                        <div title={titleTxt}>{rateBook.contract_type || 'BCH/PCH'}</div>
                    </div>
                    <div>
                        {errors}
                    </div>
                    {(this.state.saveToGarageButtonClicked && !this.props.user) && (
                        <div>
                            {(this.state.showPasswordForm) && (
                                <fieldset>
                                    <h3> Enter a password to setup your garage</h3>
                                    <Form
                                        onSubmit={this.onSubmitCreateUser} validate={validateCreateUser}
                                        render={({submitError, handleSubmit, form, submitting, pristine, values}) => (
                                            <form id="login" action="login" method="post" onSubmit={handleSubmit}>
                                                <div>
                                                    <Field name="password">
                                                        {({input, meta}) => (
                                                            <div className="form-group">
                                                                <input {...input} type="password" placeholder="Password" className="form-control"/>
                                                                {(meta.error || meta.submitError) && meta.touched && (
                                                                    <div className="red">{meta.error || meta.submitError}</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Field>
                                                </div>
                                                <div>
                                                    <Field name="passwordverify">
                                                        {({input, meta}) => (
                                                            <div className="form-group">
                                                                <input {...input} type="password" placeholder="Verify your Password" className="form-control"/>
                                                                {(meta.error || meta.submitError) && meta.touched && (
                                                                    <div className="red">{meta.error || meta.submitError}</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Field>
                                                </div>
                                                <div>
                                                    <button type="submit" className="btn">Create Garage</button>
                                                </div>
                                                {submitError && <div className="error">{submitError}</div>}
                                            </form> )}
                                    />
                                    <div>
                                        <a onClick={e=>this.setState({showPasswordForm:false})}>Click here to login. </a>
                                    </div>
                                </fieldset>
                            )}

                            {(!this.state.showPasswordForm) && (
                                <fieldset>
                                    <h3>Login to add this vehicle to your garage</h3>
                                    <Form
                                        onSubmit={this.onSubmitLoginUser} validate={validateLogin}
                                        render={({submitError, handleSubmit, form, submitting, pristine, values}) => (
                                            <form id="login" action="login" method="post" onSubmit={handleSubmit}>
                                                <div>
                                                    <Field name="email">
                                                        {({input, meta}) => (
                                                            <div className="form-group">
                                                                <input {...input} type="text" placeholder="Email" className="form-control"/>
                                                                {(meta.error || meta.submitError) && meta.touched && (
                                                                    <div className="red">{meta.error || meta.submitError}</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Field>
                                                </div>
                                                <div>
                                                    <Field name="password">
                                                        {({input, meta}) => (
                                                            <div className="form-group">
                                                                <input {...input} type="password" placeholder="Password" className="form-control"/>
                                                                {(meta.error || meta.submitError) && meta.touched && (
                                                                    <div className="red">{meta.error || meta.submitError}</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Field>
                                                </div>
                                                <div>
                                                    <button type="submit" className="btn">Login</button>
                                                </div>
                                                {submitError && <div className="error">{submitError}</div>}
                                            </form> )}
                                    />
                                    <div>
                                        <a onClick={e=>this.setState({showPasswordForm:true})}>Click here to create an account. </a>
                                    </div>
                                </fieldset>
                            )}
                        </div>
                    )}
                    {(this.state.saveToGarageButtonClicked && this.props.user) && (
                        <a href="/garage" className="btn">See this in your garage</a>
                    )}

                    {!this.state.saveToGarageButtonClicked && (
                        <div>
                            <button className="btn" onClick={this.onClickSaveToGarage}>Save to my garage</button>
                        </div>
                    )}

                    <div>
                        <div>
                            Contract terms including mileage, initial payments and contract length can be tailored to your requirements.
                        </div>
                        {!this.state.requestCallbackReceived && <div>
                            <button className="btn" onClick={this.requestOfficialQuote}>Request a Callback</button>
                        </div>}
                        {this.state.requestCallbackReceived && <div>
                            <h3>Request Received. </h3>
                            A team member will be in contact with you.
                        </div>}
                    </div>


                </div>
                <div className="small">* Please read our  <a href="https://www.osv.ltd.uk/conditions/" target="_blank">T&amp;Cs</a>

                </div>
            </div>
        );
    }
}

const validateLogin = values => {
    let errors = {};
    if (!values.email) {
        errors.email = "Please enter your email. ";
    }
    if (!values.password) {
        errors.password = "Please enter a password. ";
    }
    return errors;
};

const validateCreateUser = values => {
    let errors = {};
    if (!values.password) {
        errors.email = "Please enter your password. ";
    }
    if (!values.passwordverify) {
        errors.passwordverify = "Please enter the same password as above. ";
    }
    else if (values.password != values.passwordverify) {
        errors.passwordverify = "Please enter the same password as above. ";
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
};

export default connect(mapStateToProps, {
    createUser,
    createGarageItem,
    requestCallback,
    attemptLogin
})(GuideQuotesPrice);
