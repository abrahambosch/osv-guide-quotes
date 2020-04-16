import React from 'react';

class RateBookUploadList extends React.Component {
    componentDidMount() {

    }
    render() {
        let rateBookUploadList = this.props.rateBookUploadList;
        const trItems = rateBookUploadList.map((item,index) => (
            <tr key={index}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.funder}</td>
                <td>{item.filename}</td>
                <td>{item.expiration}</td>
                <td>{item.active}</td>
                <td><button
                    onClick={(e) => {e.preventDefault(); this.props.onSelectedRateBookUpload(item)}}
                    className="btn btn-xs btn-info"
                >View</button></td>
                <td></td>
            </tr>
        ));
        return (<div>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Funder</th>
                    <th>Filename</th>
                    <th>Expiry</th>
                    <th>Active</th>
                    <th><button onClick={this.props.onClickedNewRateBookUpload} className="btn btn-xs btn-primary">New</button></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {trItems}
                </tbody>
            </table>

        </div>);
    }
}


export default RateBookUploadList;
