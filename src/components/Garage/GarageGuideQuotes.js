import React from 'react';
import { getGarageItems, selectGarageGuideQuote, deselectGarageGuideQuote, removeGarageItem } from '../../actions';
import { connect } from 'react-redux';
import GarageGuideQuote from './GarageGuideQuote';

class GarageGuideQuotes extends React.Component {
    constructor(props) {
        super(props);
        this.viewGarageItem = this.viewGarageItem.bind(this);
        this.removeGarageItem = this.removeGarageItem.bind(this);
    }
    componentDidMount() {
        this.props.getGarageItems();
    }
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.user_id !== prevProps.user_id) {
            this.props.getGarageItems();
        }
    }

    viewGarageItem(item) {
        console.log("viewGarageItem", item);
        this.props.selectGarageGuideQuote(item);
        window.scrollTo({
            top: 100,
            left: 0,
            behavior: 'smooth'
        });
    }
    removeGarageItem(item) {
        console.log("removeGarageItem", item);

        if (window.confirm("are you sure you want to remove this item?\nItem: "+item.rate_book.name)) {
            this.props.removeGarageItem(item);
        }
    }

    render() {
        const titleTxt = "BCH = Business Contract Hire\n" +
            "PCH = Personal Contract Hire\n" +
            "BOL = Business Operating Lease\n" +
            "POL = Personal Operating Lease";
        let rows = null;
        if (this.props.garageGuideQuotes.length) {
            rows = this.props.garageGuideQuotes.map((item, i) => {
                console.log("looking at item: ", item);
                const { name, monthly_price,contract_term, expiration, contract_type } = item.rate_book;
                console.log("here are the items destructured", name, monthly_price,contract_term, expiration);
                let nameArr = name.split(" ").filter(item=>item!="");
                let nameFormated = name;
                if (nameArr[0] == nameArr[1]) {
                    nameArr.shift();
                    nameFormated = nameArr.join(' ');
                }
                return (<tr key={i}>
                    <td>{nameFormated}</td>
                    <td>£{monthly_price} + VAT</td>
                    <td>{contract_term} months</td>
                    <td><div title={titleTxt}>{contract_type}</div></td>
                    <td>{expiration}</td>
                    <td>
                        <button onClick={e => this.viewGarageItem(item)} className="btn">View</button>
                    </td>
                    <td>
                        <button onClick={e => this.removeGarageItem(item)} className="btn">Remove</button>
                    </td>
                </tr>);
            });
        };

        console.log("rows", rows);

        // if (this.props.selectedGarageGuideQuote != null) {
        //
        // }

        return (<div>
            {this.props.selectedGarageGuideQuote != null && (
                <GarageGuideQuote guideQuote={this.props.selectedGarageGuideQuote} deselectGarageGuideQuote={this.props.deselectGarageGuideQuote}/>
            )}
            <table className='table'>
                <thead>
                <tr>
                    <th>Vehicle</th>
                    <th>Monthly Price</th>
                    <th>Contract Length</th>
                    <th>Contract Type</th>
                    <th>Expiry Date</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
        </div>);
    }
}


const mapStateToProps = state => {
    return {
        garageGuideQuotes: state.garageGuideQuotes,
        selectedGarageGuideQuote: state.selectedGarageGuideQuote,
        user_id: state.auth.user?state.auth.user.user_id:''
    };
}

export default connect(
    mapStateToProps,
    { getGarageItems, selectGarageGuideQuote, deselectGarageGuideQuote, removeGarageItem }
)(GarageGuideQuotes);