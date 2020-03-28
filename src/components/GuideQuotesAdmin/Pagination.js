import React from "react";

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startPage: 1,
            numPagesToShow: 10
        }
        this.handleSetStartPage = this.handleSetStartPage.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    handleSetStartPage(e, nextPage) {
        nextPage = parseInt(nextPage);
        e.preventDefault();
        this.setState({startPage: nextPage});
    }
    handleClick(e, i) {
        e.preventDefault();
        this.props.onPageChange(i);
       console.log("you clicked this item: " + i);
    }
    render() {
        let {startPage, numPagesToShow}  = this.state;
        let {currentPage, lastPage}  = this.props;
        let itemArr = [];
        let nextPage = currentPage+1 <= lastPage?currentPage+1:lastPage;
        let prevPage = currentPage > 1?currentPage - 1:1;
        let nextPageSet = (startPage + numPagesToShow <= lastPage)?startPage + numPagesToShow:lastPage;
        let prevPageSet = (startPage - numPagesToShow >= 1)?startPage - numPagesToShow:1;

        itemArr.push(<li key={'prev'}>
            <a href="#" aria-label="Previous" onClick={(e) => this.handleClick(e, prevPage)}>
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>);

        if (startPage > 1) {
            itemArr.push(<li key={'first'}>
                <a href="#"  onClick={(e) => this.handleClick(e, 1)}>1</a>
            </li>);
            itemArr.push(<li key={'dotdotdot1'}>
                <a href="#" aria-label="Previous" onClick={(e) => this.handleSetStartPage(e, prevPageSet)}>
                    <span aria-hidden="true">...</span>
                </a>
            </li>);
        }


        for (let i=startPage; i<nextPageSet; i++) {
            if (i == currentPage) {
                itemArr.push(<li key={i} className={"active"}><a href="#">{i}</a></li>);
            }
            else {
                itemArr.push(<li key={i}><a href="#" onClick={(e) => this.handleClick(e, i)}>{i}</a></li>);
            }
        }
        if (startPage + numPagesToShow < lastPage) {
            itemArr.push(<li key={'dotdotdot2'}>
                <a href="#" aria-label="Next" onClick={(e) => this.handleSetStartPage(e, nextPageSet)}>
                    <span aria-hidden="true">...</span>
                </a>
            </li>);
            itemArr.push(<li key={'last'}><a href="#"  onClick={(e) => this.handleClick(e, lastPage)}>{lastPage}</a></li>);
        }
        itemArr.push(<li key={'next'}>
            <a href="#" aria-label="Next" onClick={(e) => this.handleClick(e, nextPage)}>
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>);

        return (
            <div>
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        {itemArr}
                    </ul>
                </nav>
            </div>
        )
    }
}

export default Pagination;