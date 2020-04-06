import React from 'react';
import axios from 'axios';
import RateBookUploadList from './RateBookUploadList';
import RateBookUploadForm from './RateBookUploadForm';
import RateBookList from './RateBookList';
import RateBookEdit from "./RateBookEdit";
import Modal from "./Modal";
//import Modal from 'react-modal';


let api_url = "https://api.osv.ltd.uk";
if (window.location.hostname == 'localhost' || window.location.hostname == 'staging.osv.ltd.uk') {
    api_url = "https://staging-api.osv.ltd.uk";
}


class GuideQuotesAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            api_url: this.props.api_url?this.props.api_url:api_url,
            errors: [],
            rateBookUploadList: [],
            rateBooksUploadsPage: 1,
            rateBooksUploadSelected: null,
            rateBookUploadId: null,
            rateBookList: [],
            rateBookPage: 1,
            rateBookTotalPages: 1,

            specialsList: [],
            specialsListPage: 1,
            specialsListTotalPages: 1,
            overridesList: [],
            overridesListPage: 1,
            overridesListTotalPages: 1,

            editRateBook: null,
            editRateBookShow: false,     // show the popup to edit a rateBook

            rateBookUploadModalShow: false,

            selectedTab: 'ratesbook',
            tabs: [
                {
                    name: 'ratesbook',
                    label: 'Rates book'
                },
                {
                    name: 'specialoffers',
                    label: 'Special Offers'
                },
                {
                    name: 'overrides',
                    label: 'Overrides'
                }
            ]
        };
        this.onCloseRateBookUploadModal = this.onCloseRateBookUploadModal.bind(this);
        this.onCloseEditRateBookModal = this.onCloseEditRateBookModal.bind(this);
        this.selectTab = this.selectTab.bind(this);
        this.onClickEditRateBook = this.onClickEditRateBook.bind(this);
        this.onClickNewRateBook = this.onClickNewRateBook.bind(this);
        this.onSubmitRateBookUploadForm = this.onSubmitRateBookUploadForm.bind(this);
        this.onSubmitEditRateBookForm = this.onSubmitEditRateBookForm.bind(this);
        this.onDeleteRateBook = this.onDeleteRateBook.bind(this);
        this.reportError = this.reportError.bind(this);
        this.removeError = this.removeError.bind(this);
        this.specialsListPageChange = this.specialsListPageChange.bind(this);
        this.overridesListPageChange = this.overridesListPageChange.bind(this);
        this.rateBookListPageChange = this.rateBookListPageChange.bind(this);
        this.onSelectedRateBookUpload = this.onSelectedRateBookUpload.bind(this);
        this.onClickedNewRateBookUpload = this.onClickedNewRateBookUpload.bind(this);
        this.loadRateBookUploads = this.loadRateBookUploads.bind(this);

    }

    reportError(error) {
        this.setState((state, props) => {
            let errors = [...state.errors, error];
            return {errors};
        });
    }
    selectTab(tab) {
        let selectedTab = tab.name;
        this.setState({selectedTab})
    }
    componentDidMount() {
        this.loadRateBookUploads();
        this.loadSpecials();
        this.loadOverrides();
    }
    reloadLists() {
        this.loadSpecials(this.state.specialsListPage);
        this.loadOverrides(this.state.overridesListPage);
    }
    onSubmitRateBookUploadForm(obj) {
        const url = this.state.api_url + '/rateBookUploads/import';
        const formData = new FormData();
        formData.append('new_ratesbook_file', obj.file);
        formData.append('new_ratesbook_description', obj.description);
        formData.append('new_ratesbook_expiration', obj.expiration);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        // return axios.post(url, formData, config)
        return axios({
            url: url,
            method: 'POST',
            data: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': "multipart/form-data"
            }
        }).then((response) => {
            console.log(response);
            this.reloadLists();
            this.loadRateBookUploads();
            this.setState({rateBookUploadModalShow: false});
        }).catch((error) => {
            console.log(error);
            this.reportError(error);
        });
    }
    onSubmitEditRateBookForm(rateBook) {
        console.log("onSubmitEditRateBookForm called. ", rateBook);
        // save
        if (rateBook.id) {  // update existing
            const url = this.state.api_url + "/rateBooks/" + rateBook.id;
            return axios.put(url, rateBook).then((response) => {
                console.log(response);
                this.setState({editRateBookShow: false});
                this.reloadLists();
            }).catch((error) => {
                console.log(error);
                this.reportError(error);
            });
        }
        else {  // create new
            const url = this.state.api_url + "/rateBooks";
            return axios.post(url, rateBook).then((response) => {
                console.log(response);
                this.setState({editRateBookShow: false});
                this.reloadLists();
            }).catch((error) => {
                console.log(error);
                this.reportError(error);
            });
        }
        // reload lists.
    }
    onClickNewRateBook(editRateBook) {
        const editRateBookShow = true;
        editRateBook = Object.assign({
            id: null,
            book_type: "SPECIAL",
            expiration: null,
            active: 1
        }, editRateBook);
        this.setState({editRateBook, editRateBookShow}, () => {

        });
    }
    onClickEditRateBook(editRateBook) {
        const editRateBookShow = true;
        this.setState({editRateBook, editRateBookShow}, () => {

        });
    }
    onDeleteRateBook(rateBook) {
        const url = this.state.api_url + "/rateBooks/" + rateBook.id;
        return axios.delete(url).then((response) => {
            console.log(response);
            this.reloadLists();
        }).catch((error) => {
            console.log(error);
            this.reportError(error);
        });
    }
    onCloseEditRateBookModal() {
        let editRateBookShow = false;
        this.setState({editRateBookShow});
    }
    loadRateBookUploads() {
        var url = this.state.api_url + '/rateBookUploads';
        return axios.get(url, {
            params: {
                page: this.state.rateBooksUploadsPage
            }
        }).then((response) => {
            console.log(response);
            let rateBookUploadList = response.data.data;
            this.setState({rateBookUploadList});
        }).catch((error) => {
            console.log(error);
        });
    }
    onSelectedRateBookUpload(rateBooksUploadSelected) {
        this.setState({rateBooksUploadSelected}, () => {
            return this.loadRateBook(rateBooksUploadSelected.id, 1);
        })

    }
    onClickedNewRateBookUpload() {
        this.setState({rateBookUploadModalShow: true});
    }
    onCloseRateBookUploadModal() {
        this.setState({rateBookUploadModalShow: false});
    }
    rateBookListPageChange(page) {
        return this.loadRateBook(this.state.rateBookUploadId, page);
    }
    loadRateBook(rateBookUploadId, page) {
        page = page?page:1;
        var url = this.state.api_url + '/rateBooks';
        return axios.get(url, {
            params: {
                rate_book_upload_id: rateBookUploadId,
                page: page
                //book_type: 'SPECIAL'
            }
        }).then((response) => {
            console.log(response);
            let rateBookList = response.data.data;
            let rateBookListPage = response.data.current_page;
            let rateBookListTotalPages = response.data.last_page;
            this.setState({rateBookUploadId, rateBookList, rateBookListPage, rateBookListTotalPages});
        }).catch((error) => {
            console.log(error);
        });
    }
    loadSpecials(page) {
        page = page?page:1;
        var url = this.state.api_url + '/rateBooks';
        return axios.get(url, {
            params: {
                page: page,
                book_type: 'SPECIAL'
            }
        }).then((response) => {
            console.log(response);
            let specialsList = response.data.data;
            let specialsListPage = response.data.current_page;
            let specialsListTotalPages = response.data.last_page;
            this.setState({specialsList, specialsListPage, specialsListTotalPages});
        }).catch((error) => {
            console.log(error);
        });
    }
    loadOverrides(page) {
        page = page?page:1;
        var url = this.state.api_url + '/rateBooks';
        return axios.get(url, {
            params: {
                page: page,
                book_type: 'OVERRIDE'
            }
        }).then((response) => {
            console.log(response);
            let overridesList = response.data.data;
            let overridesListPage = response.data.current_page;
            let overridesListTotalPages = response.data.last_page;
            this.setState({overridesList, overridesListPage, overridesListTotalPages});
        }).catch((error) => {
            console.log(error);
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
    overridesListPageChange(i) {
        console.log("overridesListPageChange: " + i);
        this.loadOverrides(i);

    }
    specialsListPageChange(i) {
        console.log("specialsListPageChange: " + i);
        this.loadSpecials(i);
    }
    render() {
        const tabs = this.state.tabs.map((item,index) => {
            let className = item.name === this.state.selectedTab ? "active" : "";
            let href = '#' + item.name;
            return (
                <li role="presentation" className={className} key={index}>
                    <a href={href} aria-controls={item.name} role="tab" data-toggle="tab" onClick={e=>{e.preventDefault(); this.selectTab(item)}}>{item.label}</a>
                </li>
            );
        });

        let editRateBook = !this.state.editRateBookShow?"":(
            <Modal
                isOpen={this.state.editRateBookShow}
                onClose={this.onCloseEditRateBookModal}
                showFooter={false}
                title={""}
            >
                <RateBookEdit
                    api_url={this.state.api_url}
                    onSubmit={this.onSubmitEditRateBookForm}
                    onClose={this.onCloseEditRateBookModal}
                    rateBook={this.state.editRateBook}
                ></RateBookEdit>
            </Modal>
        );


        let errors = this.state.errors.map((item, i) => {
            if (typeof item === 'object') item = JSON.stringify(item);
            return (<div key={i} className={"alert alert-danger alert-dismissible"} role="alert" onClick={()=> {this.removeError(i)}}>{item}</div> );
        })

        return (<div>
            <h1>Guide Quotes</h1>
            {errors}
            {editRateBook}
            <div>
                <ul className="nav nav-tabs" role="tablist">
                    {tabs}
                </ul>
                { this.state.selectedTab === 'ratesbook' && (
                    <div id="ratesbook">
                        <RateBookUploadList
                            rateBookUploadList={this.state.rateBookUploadList}
                            onSelectedRateBookUpload={this.onSelectedRateBookUpload}
                            onRateBookUploadSelected={this.onRateBookUploadSelected}
                            onClickedNewRateBookUpload={this.onClickedNewRateBookUpload}
                        ></RateBookUploadList>
                        {this.state.rateBookUploadModalShow && (
                            <Modal
                                isOpen={this.state.rateBookUploadModalShow}
                                onClose={this.onCloseRateBookUploadModal}
                                showFooter={false}
                                title={""}
                            >
                                <RateBookUploadForm
                                    onSubmit={this.onSubmitRateBookUploadForm}
                                ></RateBookUploadForm>
                            </Modal>
                        )}

                        {this.state.rateBooksUploadSelected && (<div>
                            <h2>Rate Book: {this.state.rateBooksUploadSelected.filename}</h2>
                            <RateBookList
                                api_url={this.state.api_url}
                                rateBookList={this.state.rateBookList}
                                currentPage={this.state.rateBookListPage}
                                lastPage={this.state.rateBookListTotalPages}
                                editRateBook={this.editRateBook}
                                onClickEditRateBook={this.onClickEditRateBook}
                                onClickNewRateBook={this.onClickNewRateBook}
                                onDeleteRateBook={this.onDeleteRateBook}
                                onPageChange={this.rateBookListPageChange}
                                bookType="BOOK"
                            ></RateBookList>
                        </div>
                        )}
                    </div>
                )
                }
                { this.state.selectedTab === 'specialoffers' && (
                <div id="specialoffers">
                    <RateBookList
                        api_url={this.state.api_url}
                        rateBookList={this.state.specialsList}
                        currentPage={this.state.specialsListPage}
                        lastPage={this.state.specialsListTotalPages}
                        editRateBook={this.editRateBook}
                        onClickEditRateBook={this.onClickEditRateBook}
                        onClickNewRateBook={this.onClickNewRateBook}
                        onDeleteRateBook={this.onDeleteRateBook}
                        onPageChange={this.specialsListPageChange}
                        bookType="SPECIAL"
                        ></RateBookList>
                </div>
                )}
                { this.state.selectedTab === 'overrides' && (
                <div id="overrides">
                    <RateBookList
                        api_url={this.state.api_url}
                        rateBookList={this.state.overridesList}
                        currentPage={this.state.overridesListPage}
                        lastPage={this.state.overridesListTotalPages}
                        editRateBook={this.editRateBook}
                        onClickEditRateBook={this.onClickEditRateBook}
                        onClickNewRateBook={this.onClickNewRateBook}
                        onDeleteRateBook={this.onDeleteRateBook}
                        onPageChange={this.overridesListPageChange}
                        bookType="OVERRIDE"
                    ></RateBookList>
                </div>
                )}

            </div>
        </div>);
    }
}


export default GuideQuotesAdmin;
