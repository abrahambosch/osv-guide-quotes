import React from 'react';
import axios from 'axios';
import GuideQuotesPrice from "./GuideQuotesPrice";
import { connect } from 'react-redux';

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

    onSubmit = (e) => {
        e.preventDefault();
        console.log("onSubmit: ", this.state);
        //this.setState({selectedTab})
        let {name, phone, email, consent, seomake, seomodel} = this.state;
        phone = phone.replace(/[^0-9]/g, "");
        let data = {name, phone, email, consent, seomake, seomodel};
        console.log("submitting quote: ", data);
        axios.post(this.state.api_url + '/quotes', data).then((response) => {
            console.log(response);
            if (response.data.data.rateBook) {
                this.setState({rateBook: response.data.data.rateBook})
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

        let {rateBook} = this.state;
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
        else {
            return (
                <div className="request-guide-price">
                    <h2>Want this car at a great price?</h2>
                    <p>Request a callback and we'll find you a great price to buy or lease. </p>
                    {errors}
                    <form onSubmit={this.onSubmit}>
                        <div>
                            <div className="form-group">
                                <input className="form-control"
                                       type="text"
                                       name="name"
                                       value={this.state.name}
                                       onChange={this.handleChange}
                                       placeholder="Name"/>
                            </div>
                        </div>
                        <div>
                            <div className="form-group">
                                <input className="form-control"
                                       type="phone"
                                       name="phone"
                                       value={this.state.phone}
                                       onChange={this.handleChange}
                                       placeholder="UK Phone Number"/>
                            </div>
                        </div>
                        <div>
                            <div className="form-group">
                                <input className="form-control"
                                       type="email"
                                       name="email"
                                       value={this.state.email}
                                       onChange={this.handleChange}
                                       placeholder="Email"/>
                            </div>
                        </div>
                        <div className="request-guide-price-consent">
                            <label>Consent<span>*</span></label>
                            <input type="checkbox" name="consent" value={this.state.consent}
                                   onChange={this.handleChange}/>
                            By ticking this box you are agreeing that OSV Ltd can process and store the data that you
                            have entered in this form - as well as any other information provided during our sales
                            processes.
                        </div>
                        <div>
                            <div className="form-group">
                                <input type="submit" className="btn" value="Request guide price"/>
                            </div>
                        </div>
                    </form>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        user: state.auth && state.auth.user,
        callbackRequests: state.callbackRequests,
        garageGuideQuotes: state.garageGuideQuotes
    }
}

export default connect(mapStateToProps, {})(GuideQuotes);
