import React from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';

const KEY = 'AIzaSyAAuOT-2JVhu7IZ-mlC44DdD8cSc790BIg';

let onTermSubmit = async term => {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
            q: term,
            part: "snippet",
            maxResults: 5,
            type: 'video',
            key: KEY
        }
    });
    return response;
};

class VideoSearchApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchBar: "",
            searchResults: [],
            selectedItem: null,
            errors: ['testing']
        };

        this.onSearchBarSubmit = this.onSearchBarSubmit.bind(this);
        this.reportError = this.reportError.bind(this);
        this.removeError = this.removeError.bind(this);
    }
    reportError(error) {
        this.setState((state, props) => {
            let errors = [...state.errors, error];
            return {errors};
        });
    }
    removeError(i) {
        console.log("removing error: ", i);
        let errors = this.state.errors.filter((item, j) => {
            if (i!=j) return true;
            return false;
        });
        this.setState({errors});
    }
    onSearchBarSubmit(searchTerm) {
        console.log("onSearchBarSubmit", searchTerm);
        let results = onTermSubmit(searchTerm);
    }
    render() {
        return (<div>
                 <SearchBar
                    onSubmit={this.onSearchBarSubmit}
                 />
        </div>);
    }
}


export default VideoSearchApp;