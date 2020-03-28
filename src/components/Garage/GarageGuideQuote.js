import React from 'react';
import {connect} from "react-redux";
import { requestCallback } from '../../actions';

function nf(n) {
    n = Math.floor(n);
    n = n.toLocaleString();
    return n;
}

const GuidePrice = (props) => {
    const rateBook = props.guideQuote.rate_book;
    return <div className="guide-price">
        <div className="guide-price-box">
            <h2>Guide Price</h2>
            <div className={"guide-price-price"}>
                £{nf(rateBook.monthly_price)} + VAT * per month
            </div>
            <div className="guide-price-body">
                Based on {nf(rateBook.mileage)} per year<br/>
                £{nf(rateBook.initial_payment)} + VAT initial payment<br/>
                {rateBook.contract_length} month contract<br/>
                {rateBook.contract_term}
            </div>
            <div>
                Ready to secure your
            </div>
            <div>
                <button className="btn" onClick={props.onClickRequestCallback}>Request a call back</button>
            </div>
            <div className="small">*pricing is subject to availability. T&amp;C's and the above contract conditions
            </div>
        </div>
    </div>;
};

class RequestCallbackForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            phone: ""
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    onSubmit() {
        this.props.onSubmitRequestCallbackForm(this.state.name, this.state.phone);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        })
    }

    render() {
        return <div className="guide-price">
            <div className="guide-price-box">
                <h2>Talk to a Vehicle Specialist</h2>
                <p>Request a callback from one of our vehicle specialists
                    who will be able to talk through the offer and
                    any amends you would like to make and provide you with an official quote. </p>

                <div className="guide-price-body">
                    {this.props.requestCallbackFormReceived && (
                        <div><h3>Thank you, request received.</h3></div>
                    )}
                    {!this.props.requestCallbackFormReceived && (
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <input type="text" name="name" value={this.state.name} onChange={this.handleChange}
                                   placeholder="Name"/>
                        </div>
                        <div className="form-group">
                            <input type="phone" name="phone" value={this.state.phone} onChange={this.handleChange}
                                   placeholder="Phone number"/>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn">Request a call back</button>
                        </div>
                    </form>
                    )}
                </div>
                <div className="small">*pricing is subject to availability. T&amp;C's and the above contract
                    conditions
                </div>
            </div>
        </div>;
    }
};

class GarageGuideQuote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requestCallbackClicked: false,
            requestCallbackFormReceived: false,
        }
        this.onClickRequestCallback = this.onClickRequestCallback.bind(this);
        this.onSubmitRequestCallbackForm = this.onSubmitRequestCallbackForm.bind(this);
    }

    componentDidMount() {

    }
    getUserId() {
        return this.props.user_id?this.props.user_id:window.osv_react_wp.user_id;
    }
    onSubmitRequestCallbackForm(name, phone) {
        this.props.requestCallback(this.getUserId(), name, phone);
        this.setState({ requestCallbackFormReceived: true});
    }

    onClickRequestCallback() {
        this.setState({requestCallbackClicked: true});
    }

    render() {
        const q = this.props.guideQuote;
        const img = `https://staging.osv.ltd.uk/${q.rate_book.derivative.capmod.image}`;

        let right = null;
        if (this.state.requestCallbackClicked) {
            right = <RequestCallbackForm guideQuote={q} onSubmitRequestCallbackForm={this.onSubmitRequestCallbackForm} requestCallbackFormReceived={this.state.requestCallbackFormReceived} />;
        } else {
            right = <GuidePrice guideQuote={q} onClickRequestCallback={this.onClickRequestCallback}/>;
        }

        return (<div className="garage-guide-quote">
            <div className="row garage-guide-quote-top">
                Guide Quotes > {q.rate_book.name}
                <a href="#" onClick={e => {e.preventDefault(); this.props.deselectGarageGuideQuote() }}>
                    <span className="glyphicon glyphicon-remove pull-right" aria-hidden="true"></span>
                </a>
            </div>
            <div className="row">
                <div className="col-md-8">
                    <img src={img} className="img-responsive"/>
                </div>
                <div className="col-md-4">
                    {right}
                </div>
            </div>
        </div>);
    }
}

const mapStateToProps = state => {
    return {
        selectedGarageGuideQuote: state.selectedGarageGuideQuote
    };
}

export default connect(
    mapStateToProps,
    { requestCallback }
)(GarageGuideQuote);
