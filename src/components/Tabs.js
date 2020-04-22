import React from 'react';
/*
<Tabs>
    <Tab label={"Guide Quotes"}><GarageGuideQuotes /></Tab>
    <Tab label={"Official Quotes"}><GarageOfficialQuotes /></Tab>
    <Tab label={"My Account"}><GarageMyAccount /></Tab>
</Tabs>
 */
export class Tabs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabGroupName: "defaultTab",
            selectedTab: 0,
            tabs: []
        };

        this.selectTab = this.selectTab.bind(this);
    }
    selectTab(i) {
        let selectedTab = i;
        this.setState({selectedTab})
    }
    render() {
        console.log("render", this.props.children);
        let tabs = this.props.children.map((item, i) => {
            let className = i === this.state.selectedTab ? "active" : "";
            let name = this.state.tabGroupName + i;
            let href = '#' + name;
            return (
                <li role="presentation" className={className} key={i}>
                    <a href={href} aria-controls={name} role="tab" data-toggle="tab" onClick={e=>{e.preventDefault(); this.selectTab(i)}}>{item.props.label}</a>
                </li>
            );
        });

        let tabContent = this.props.children.filter((item, i) => {
            return i === this.state.selectedTab;
        });

        return <div>
            <ul className="nav nav-tabs" role="tablist">
                {tabs}
            </ul>
            {tabContent}
        </div>;
    }
}

export const Tab = (props) => {
    return <div>{props.children}</div>
};


