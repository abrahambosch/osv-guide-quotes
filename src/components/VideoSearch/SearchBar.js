import React from 'react';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchBar: ""
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = 'type' in event.target && event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        })
    }
    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state.searchBar);
    }
    render() {
        return (<div>
            <form onSubmit={this.onSubmit}>
                <div className={"form-group"}>
                    <label>Search</label>
                    <input
                        type={"text"}
                        onChange={this.handleChange}
                        name="searchBar"
                        value={this.state.searchBar}
                        placeholder={"Search"}
                        className={"search-bar"}
                    />
                </div>
            </form>
        </div>);
    }
}


export default SearchBar;