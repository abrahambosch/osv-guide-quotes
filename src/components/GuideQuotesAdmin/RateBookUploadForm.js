import React from 'react';
import loading_img from '../../images/giphy.gif';

class RateBookUploadForm extends React.Component {
    componentDidMount() {

    }

    constructor(props) {
        super(props);
        this.state ={
            file:null,
            description: "",
            expiration: "",
            funder: "",
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    onFileChange(e) {
        //this.setState({file:e.target.files[0]})
        this.setState({file:e.target.files[0]});
    }
    onFormSubmit(e){
        e.preventDefault() // Stop form submit
        this.props.onSubmit({
            file: this.state.file,
            description: this.state.description,
            expiration: this.state.expiration,
            funder: this.state.funder
        });
    }
    handleChange(event) {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        })
    }
    render() {
        return (<div>
            <fieldset>
                <legend>Add New Rate Book</legend>
                <div className="row">
                    <div className="col-sm-6">
                        <form className="form" action="https://staging-api.osv.ltd.uk/rateBookUploads/import" method="post" encType="multipart/form-data" onSubmit={this.onFormSubmit}>
                            <input type="hidden" name="osv_new_ratesbook_file_form" value="1"/>
                            <div className="form-group">
                                <label>Book Description</label>
                                <input className="form-control" type="text" name="description"
                                       value={this.state.description} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Funder</label>
                                <input className="form-control" type="text" name="funder"
                                       value={this.state.funder} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Book Expiration</label>
                                <input className="form-control" type="date" name="expiration"
                                       value={this.state.expiration} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Book File CSV</label>
                                <input type="file" className="filestyle" data-buttontext="Find file"
                                       name="file" onChange={this.onFileChange}/>
                            </div>
                            <div>
                                <button type="submit">Upload</button>
                            </div>
                            {this.props.showLoading && (
                                <div>
                                    <img src={loading_img} alt="loading" style={{width: '100px'}}/>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </fieldset>
        </div>);
    }
}


export default RateBookUploadForm;
