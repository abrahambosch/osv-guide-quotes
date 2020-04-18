import React from 'react';
import { connect } from 'react-redux';
import { createUser, createGarageItem, requestCallback } from '../../actions';


let api_url = "https://api.osv.ltd.uk";
if (window.location.hostname === 'localhost' || window.location.hostname === 'staging.osv.ltd.uk') {
    api_url = "https://staging-api.osv.ltd.uk";
}

function formatErrors(obj) {
    let items = [];
    let i = 0;
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

    onSubmitCreateUser = (e) => {
        e.preventDefault();
        console.log("onSubmit: ", this.state);
        //this.setState({selectedTab})
        let {name, phone, email, password} = this.state;
        let name_arr = name.split(" ").filter(item => item.length);
        let first_name = name_arr.shift();
        let last_name = name_arr.join(" ");

        phone = phone.replace(/[^0-9]/g, "");
        this.props.createUser(first_name, last_name, phone, email, password, (error, user) =>{
            console.log("created a user. ", user);
            this.addToGarage(user);
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
        const { name, phone } = this.state;
        const rate_books_id = this.props.rateBook.id;
        this.props.requestCallback(name, phone, rate_books_id, (error, response) => {
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

        return (
            <div className="guide-price">
                <div className="guide-price-box">
                    <h2>Prices from</h2>
                    <div className={"guide-price-price"}>
                        £{nf(rateBook.monthly_price)} + VAT * per month
                    </div>
                    <div className="guide-price-body">
                        Based on {nf(rateBook.mileage)} miles per year<br/>
                        £{nf(rateBook.initial_payment)} + VAT initial payment<br/>
                        {rateBook.contract_length} month contract<br/>
                        {rateBook.contract_term}
                    </div>
                    {(this.state.saveToGarageButtonClicked && !this.props.user) && (
                        <form onSubmit={this.onSubmitCreateUser}>
                            <div className="form-group">
                                <label>Please create a password:</label>
                                <input type="password" name="password" value={this.state.password}
                                       onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Please confirm a password:</label>
                                <input type="password" name="passwordConfirm" value={this.state.passwordConfirm}
                                       onChange={this.handleChange}/>
                            </div>
                            <div>
                                <button type="submit" className="btn">Create Garage</button>
                            </div>
                        </form>
                    )}
                    {(this.state.saveToGarageButtonClicked && this.props.user) && (
                        <a href="/garage" className="btn">See this in your garage</a>
                    )}



                    {this.props.user && <div>
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
                    </div>}

                    {!this.state.saveToGarageButtonClicked && (
                        <div>
                            <button className="btn" onClick={this.onClickSaveToGarage}>Save to my garage</button>
                        </div>
                    )}
                </div>
                <div className="small">* Please read our  <a href="https://www.osv.ltd.uk/conditions/" target="_blank">T&amp;Cs</a>

                </div>
            </div>
        );
    }
}

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
    requestCallback
})(GuideQuotesPrice);
