import React from 'react';

class RateBookRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.editButtonClicked = this.editButtonClicked.bind(this);
        this.deleteButtonClicked = this.deleteButtonClicked.bind(this);
    }
    componentDidMount() {

    }
    editButtonClicked() {
        this.props.editRateBook(this.props.rateBook);
    }
    deleteButtonClicked() {
        this.props.deleteRateBook(this.props.rateBook);
    }
    render() {
        return (<tr>
            <td>{this.props.rateBook.name}</td>
            <td>{this.props.rateBook.monthly_price}</td>
            <td>{this.props.rateBook.initial_payment}</td>
            <td>{this.props.rateBook.contract_length}</td>
            <td>{this.props.rateBook.contract_term}</td>
            <td>{this.props.rateBook.mileage}</td>
            <td>{this.props.rateBook.expiration.substr(0,10)}</td>
            <td><button onClick={this.editButtonClicked}>Edit</button></td>
            <td><button onClick={this.deleteButtonClicked}>Delete</button></td>
        </tr>);
    }
}


export default RateBookRow;
