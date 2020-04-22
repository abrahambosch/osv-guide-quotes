import React from 'react';
import { Tabs, Tab } from '../Tabs';
import GarageOfficialQuotes from './GarageOfficialQuotes';
import GarageGuideQuotes from './GarageGuideQuotes';
import GarageMyAccount from './GarageMyAccount';
import LoginForm from "../Login/LoginForm";
import { connect } from 'react-redux';
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { RoutedTabs, NavTab } from "react-router-tabs";


 class Garage extends React.Component {
    render() {
        if (!this.props.user) {
            return <div>
                <div>Please login to access your garage.</div>
                <div style={{width: 300}}>
                    <LoginForm />
                </div>
            </div>;
        }
        return <div>
            <Router>
                <Route path="/" component={MyTabs} />
            </Router>
        </div>;
    }
}

const MyTabs = (props) => {
     console.log("mytabs", props, this);
    const { path } = props.match;
    return (
        <div>
            <div className="nav-tabs">
                <NavTab to={`${path}`} exact className="nav-tab">Garage</NavTab>
                {/*<NavTab to={`${path}quotes`} className="nav-tab">Official Quotes</NavTab>*/}
                {/*<NavTab to={`${path}account`} className="nav-tab">My Account</NavTab>*/}
            </div>
            <div className="tabs">
                <Switch>
                    <Route path={`${path}`} exact component={GarageGuideQuotes} />
                    {/*<Route path={`${path}quotes`} component={GarageOfficialQuotes} />*/}
                    <Route path={`${path}account`} component={GarageMyAccount} />
                </Switch>
            </div>
        </div>
    );
};



const mapStateToProps = (state) => {
     return {
         user: state.auth.user
     }
};

export default connect(mapStateToProps, {

})(Garage);