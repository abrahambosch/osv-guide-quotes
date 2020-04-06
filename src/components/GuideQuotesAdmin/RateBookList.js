import React from 'react';
import Pagination from './Pagination';

class RateBookList extends React.Component {
    componentDidMount() {

    }
    render() {
        let rateBookList = this.props.rateBookList;
        const trItems = rateBookList.map((item,index) => (
            <tr key={index}>
                <td>{item.name}</td>
                <td>{item.monthly_price}</td>
                <td>{item.initial_payment}</td>
                <td>{item.contract_length}</td>
                <td>{item.contract_term}</td>
                <td>{item.mileage}</td>
                <td>{item.expiration.substr(0,10)}</td>
                <td><button className="btn btn-xs btn-info" onClick={e=>this.props.onClickEditRateBook(item)}>Edit</button></td>
                <td><button className="btn btn-xs btn-danger" onClick={e=>this.props.onDeleteRateBook(item)}>Delete</button></td>
            </tr>
        ));
        return (<div>
            <table className="table table-condensed table-hover">
                <thead>
                <tr>
                    <th>Make Model</th>
                    <th>Monthly price</th>
                    <th>Initial Payment</th>
                    <th>Contract Length</th>
                    <th>Contract Term</th>
                    <th>Mileage</th>
                    <th>Expiry</th>
                    <th><td><button className="btn btn-xs btn-primary" onClick={e=>this.props.onClickNewRateBook({book_type: this.props.bookType})}>New</button></td></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {trItems}
                </tbody>
            </table>
            {this.props.lastPage !== 1 && (
            <Pagination
                currentPage={this.props.currentPage}
                lastPage={this.props.lastPage}
                onPageChange={this.props.onPageChange}
            ></Pagination>)}
        </div>);
    }
}


export default RateBookList;
