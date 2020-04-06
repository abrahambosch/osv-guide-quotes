import React from 'react';
import { Tabs, Tab } from '../Tabs';
import GarageOfficialQuotes from './GarageOfficialQuotes';
import GarageGuideQuotes from './GarageGuideQuotes';
import GarageMyAccount from './GarageMyAccount';
import LoginForm from "../Login/LoginForm";
import { connect } from 'react-redux';

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
            <h2>Welcome to your OSV Garage</h2>
            <Tabs>
                <Tab label={"Guide Quotes"}><GarageGuideQuotes /></Tab>
                <Tab label={"Official Quotes"}><GarageOfficialQuotes /></Tab>
                <Tab label={"My Account"}><GarageMyAccount /></Tab>
            </Tabs>
        </div>;
    }
}

const mapStateToProps = (state) => {
     return {
         user: state.auth.user
     }
};

export default connect(mapStateToProps, {

})(Garage);