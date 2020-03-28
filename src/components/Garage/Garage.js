import React from 'react';
import { Tabs, Tab } from '../Tabs';
import GarageOfficialQuotes from './GarageOfficialQuotes';
import GarageGuideQuotes from './GarageGuideQuotes';
import GarageMyAccount from './GarageMyAccount';

export default class Garage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div>
            <h2>Welcome to your OSV Garage</h2>
            <Tabs>
                <Tab label={"Guide Quotes"}><GarageGuideQuotes /></Tab>
                <Tab label={"Official Quotes"}><GarageOfficialQuotes /></Tab>
                <Tab label={"My Account"}><GarageMyAccount /></Tab>
            </Tabs>
        </div>;q
    }
}
