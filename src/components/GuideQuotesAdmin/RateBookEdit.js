import React from 'react';
import axios from 'axios';


function Select(props) {
    let options = props.options.map((data) =>
        <option
            key={data.value}
            value={data.value}
        >
            {data.name}
        </option>
    );
    let name=props.name?props.name:'select_name';
    return (
        <select name={name} className="form-control" onChange={props.onSelectChange} value={props.value}>
            {options}
        </select>
    )

}


class RateBookEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rateBook: props.rateBook,
            makeOptions: [],
            rangeOptions: [],
            modelOptions: [],
            derivativeOptions: [],
            rateBookUploadOptions: []
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleMakeChange = this.handleMakeChange.bind(this);
        this.handleRangeChange = this.handleRangeChange.bind(this);
        this.handleModelChange = this.handleModelChange.bind(this);
        this.handleDerivativeChange = this.handleDerivativeChange.bind(this);

        this.loadMakes();
        this.loadRanges();
        this.loadModels();
        this.loadDerivatives();
        this.loadRateBookUploads();


        window.loadMakes = this.loadMakes.bind(this);
    }
    setRateBook(rateBook) {
        this.setState({rateBook});
    }
    componentDidUpdate(prevProps) {
        if (prevProps.rateBook === null || prevProps.rateBook.name !== this.props.rateBook.name) {
            this.setState({rateBook: this.props.rateBook}, () => {
                this.loadMakes();
                this.loadRanges();
                this.loadModels();
                this.loadDerivatives();
            });
        }
    }
    componentDidMount() {

    }
    handleMakeChange(e) {
        console.log("make changed");
        let rateBook = Object.assign({}, this.state.rateBook);
        rateBook.cder_mancode = e.target.value;
        rateBook.cder_rancode = "";
        rateBook.cder_modcode = "";
        rateBook.cder_ID = "";
        this.setState({rateBook}, () => {
            this.loadRanges();
        });
    }
    handleRangeChange(e) {
        console.log("range changed");
        let rateBook = Object.assign({}, this.state.rateBook);
        rateBook.cder_rancode = e.target.value;
        rateBook.cder_modcode = "";
        rateBook.cder_ID = "";
        this.setState({rateBook}, () => {
            this.loadModels();
        });

    }
    handleModelChange(e) {
        console.log("model changed");
        let rateBook = Object.assign({}, this.state.rateBook);
        rateBook.cder_modcode = e.target.value;
        rateBook.cder_ID = "";
        this.setState({rateBook}, () => {
            this.loadDerivatives();
        });
    }
    handleDerivativeChange(e) {
        console.log("derivative changed");
        let rateBook = Object.assign({}, this.state.rateBook);
        rateBook.cder_ID = e.target.value;
        this.setState({rateBook});
    }
    handleChange(event) {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        let rateBook = Object.assign({}, this.state.rateBook);
        rateBook[name] = value;
        this.setState({rateBook});
        // this.setState({
        //     [name]: value
        // })
    }
    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state.rateBook);
    }

    loadBook(book_id) {
        var url = this.props.api_url + '/rateBooks/' + book_id;
        axios.get(url).then(function (response) {
            console.log(response);
            var o = response.data.data;
            var rateBook = {};
            rateBook.id = o.id;
            rateBook.book_type = o.book_type;
            rateBook.rate_book_upload_id = o.rate_book_upload_id;
            rateBook.cder_mancode = o.derivative.cder_mancode;
            rateBook.cder_rancode = o.derivative.cder_rancode;
            rateBook.cder_modcode = o.derivative.cder_modcode;
            rateBook.cder_ID = o.cder_ID;
            rateBook.name = o.name;
            rateBook.monthly_price = o.monthly_price;
            rateBook.initial_payment = o.initial_payment;
            rateBook.contract_length = o.contract_length;
            rateBook.contract_term = o.contract_term;
            rateBook.mileage = o.mileage;
            rateBook.expiration = o.expiration;
            rateBook.active = o.active;
            rateBook.created_at = o.created_at;
            rateBook.updated_at = o.updated_at;
            this.setState({rateBook});

            this.loadMakes();
            this.loadRanges();
            this.loadModels();
            this.loadDerivatives();
        })
            .catch(function (error) {
                console.log(error);
            })
    }
    loadRateBookUploads() {
        var url = this.props.api_url + '/rateBookUploads';
        axios.get(url).then( (response) => {
            console.log(response);
            var rateBookUploadOptions = response.data.data.map((item, i) => {
                return {name: item.id + ' - ' + item.name, value: item.id};
            });
            this.setState({rateBookUploadOptions});
        }).catch( (error) => {
            console.log(error);
        });
    }
    loadMakes() {
        var url = this.props.api_url + '/dropdowns/getMakes';
        axios.get(url).then( (response) => {
            console.log(response);
            var makeOptions = response.data.data;
            this.setState({makeOptions});
        }).catch( (error) => {
            console.log(error);
        });
    }
    loadRanges() {
        var url = this.props.api_url + '/dropdowns/getRanges';
        if (!this.state.rateBook.cder_mancode) return;
        axios.get(url, {
            params: {
                returnEmptySelect: 1,
                nocache: 0,
                make: this.state.rateBook.cder_mancode
            }
        }).then((response) => {
            console.log(response);
            var rangeOptions = response.data.data;
            this.setState({rangeOptions});
        }).catch(function (error) {
            console.log(error);
        });
    }
    loadModels() {
        var url = this.props.api_url + '/dropdowns/getModels';
        if (!this.state.rateBook.cder_mancode) return;
        if (!this.state.rateBook.cder_rancode) return;
        axios.get(url, {
            params: {
                returnEmptySelect: 1,
                nocache: 0,
                make: this.state.rateBook.cder_mancode,
                range: this.state.rateBook.cder_rancode
            }
        }).then((response) => {
            console.log(response);
            var modelOptions = response.data.data;
            this.setState({modelOptions});
        }).catch(function (error) {
            console.log(error);
        });
    }
    loadDerivatives() {
        var url = this.props.api_url + '/dropdowns/getDerivatives';
        if (!this.state.rateBook.cder_mancode) return;
        if (!this.state.rateBook.cder_rancode) return;
        if (!this.state.rateBook.cder_mancode) return;
        axios.get(url, {
            params: {
                returnEmptySelect: 1,
                nocache: 0,
                make: this.state.rateBook.cder_mancode,
                range: this.state.rateBook.cder_rancode,
                model: this.state.rateBook.cder_modcode
            }
        }).then((response) => {
            console.log(response);
            var derivativeOptions = response.data.data;
            this.setState({derivativeOptions});
        }).catch(function (error) {
            console.log(error);
        });
    }
    render() {
        if (!this.state.rateBook) return "";

        let upload_id_input = null;
        if (this.props.bookType == 'BOOK') {
            upload_id_input = (<div className="form-group">
                <label>Rate Book Upload</label>
                <Select name="rate_book_upload_id" options={this.state.rateBookUploadOptions} onSelectChange={this.handleChange} value={this.state.rateBook.rate_book_upload_id}></Select>
            </div>);
        }
        else {
            upload_id_input = (<input type="hidden" name="rate_book_upload_id" value=""></input>);
        }


        return (<div>
            <h1>RateBook</h1>
            <div id="edit-book">
                <form name="edit_book">
                    <div className="row">
                        <div className="col-md-8">
                            {upload_id_input}
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>Book Type</label>
                                <input
                                    name="book_type"
                                    value={this.state.rateBook.book_type}
                                    onChange={this.handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    name="name"
                                    value={this.state.rateBook.name}
                                    onChange={this.handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>monthly_price</label>
                                <input
                                    name="monthly_price"
                                    value={this.state.rateBook.monthly_price}
                                    onChange={this.handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="form-group">
                                <label>Make</label>
                                <Select name="cder_mancode" options={this.state.makeOptions} onSelectChange={this.handleMakeChange} value={this.state.rateBook.cder_mancode}></Select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>initial_payment</label>
                                <input
                                    name="initial_payment"
                                    value={this.state.rateBook.initial_payment}
                                    onChange={this.handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="form-group">
                                <label>Range</label>
                                <Select name="cder_rancode" options={this.state.rangeOptions} onSelectChange={this.handleRangeChange} value={this.state.rateBook.cder_rancode}></Select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>contract_length</label>
                                <input
                                    name="contract_length"
                                    value={this.state.rateBook.contract_length}
                                    onChange={this.handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="form-group">
                                <label>Model</label>
                                <Select name="cder_modcode" options={this.state.modelOptions} onSelectChange={this.handleModelChange} value={this.state.rateBook.cder_modcode}></Select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>contract_term</label>
                                <input
                                    name="contract_term"
                                    value={this.state.rateBook.contract_term}
                                    onChange={this.handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="form-group">
                                <label>Derivative</label>
                                <Select name="cder_ID"  options={this.state.derivativeOptions} onSelectChange={this.handleDerivativeChange} value={this.state.rateBook.cder_ID}></Select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>mileage</label>
                                <input
                                    name="mileage"
                                    value={this.state.rateBook.mileage}
                                    onChange={this.handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="form-group">
                                <label>expiration</label>
                                <input
                                    name="expiration"
                                    value={this.state.rateBook.expiration}
                                    onChange={this.handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>active</label>
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={this.state.rateBook.active}
                                    onChange={this.handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>

                    <div className={'row'}>
                        <div className={'col-md-6'}></div>
                        <div className={'col-md-6'}>
                            <button className={'btn btn-primary '} onClick={this.onSubmit}>Submit</button>&nbsp;
                            <button className={'btn btn-default '} onClick={this.props.onClose}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>);
    }
}


export default RateBookEdit;
