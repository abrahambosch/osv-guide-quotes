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
            <h2>Prices from</h2>
            <div className={"guide-price-price"}>
                £{nf(rateBook.monthly_price)} + VAT per month *
            </div>
            <div className="guide-price-body">
                Based on {nf(rateBook.mileage)} miles per year<br/>
                £{nf(rateBook.initial_payment)} + VAT initial payment<br/>
                {rateBook.contract_term} month contract<br/>
                {rateBook.contract_type}
            </div>
            <div className="guide-price-official-quote">
                Want an official quote?
            </div>
            <div>
                <button className="btn" onClick={props.onClickRequestCallback}>Request an official quote</button>
            </div>
            <div className="small">* pricing subject to availability. <a href="/conditions">T&Cs</a>
            </div>
        </div>
    </div>;
};

class RequestCallbackForm extends React.Component {
    state = {
        name: this.props.user?this.props.user.display_name:"",
        phone: this.props.user?this.props.user.phone:"",
    };

    onSubmit = () => {
        this.props.onSubmitRequestCallbackForm(this.state.name, this.state.phone);
    };

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        })
    };

    render() {
        return <div className="guide-price">
            <div className="guide-price-box">
                <h2>You’re just a short call away from a great offer</h2>
                <p>Request a call back and one of our vehicle specialists will call you back to discuss your specific requirements and provide you with an official quote. </p>

                <div className="guide-price-body">
                    {this.props.requestCallbackFormReceived && (
                        <div><h3>Thank you, your official quote request has been received. One of our vehicle specialists will be calling you within 1 working day.</h3></div>
                    )}
                    {!this.props.requestCallbackFormReceived && (
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <input className="form-control" type="text" name="name" value={this.state.name} onChange={this.handleChange}
                                   placeholder="Name"/>
                        </div>
                        <div className="form-group">
                            <input className="form-control" type="phone" name="phone" value={this.state.phone} onChange={this.handleChange}
                                   placeholder="Phone number"/>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn">Request a call back</button>
                        </div>
                    </form>
                    )}
                </div>
                <div className="small">* subject to <a href="/conditions" target="_blank">T&amp;C's</a>
                </div>
            </div>
        </div>;
    }
};

class GarageGuideQuote extends React.Component {
    state = {
        requestCallbackClicked: false,
        requestCallbackFormReceived: false,
    };

    onSubmitRequestCallbackForm = (name, phone) => {
        this.props.requestCallback(name, phone);
        this.setState({ requestCallbackFormReceived: true});
    };

    onClickRequestCallback = () => {
        this.setState({requestCallbackClicked: true});
    };

    render() {
        const q = this.props.guideQuote;
        const img = `https://staging.osv.ltd.uk/${q.rate_book.derivative.capmod.image}`;

        let right = null;
        if (this.state.requestCallbackClicked) {
            right = <RequestCallbackForm user={this.props.user} guideQuote={q} onSubmitRequestCallbackForm={this.onSubmitRequestCallbackForm} requestCallbackFormReceived={this.state.requestCallbackFormReceived} />;
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
        selectedGarageGuideQuote: state.selectedGarageGuideQuote,
        user: state.auth.user?state.auth.user:null
    };
};

export default connect(
    mapStateToProps,
    { requestCallback }
)(GarageGuideQuote);
