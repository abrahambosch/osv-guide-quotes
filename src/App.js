import React from 'react';
import './App.css';
import GuideQuotes from './components/GuideQuotes/GuideQuotes';
import GuideQuotesAdmin from './components/GuideQuotesAdmin/GuideQuotesAdmin';
import VideoSearchApp from './components/VideoSearch/VideoSearchApp';
import ReactDOM from "react-dom";
import Garage from "./components/Garage/Garage";
import LoginForm from './components/Login/LoginForm';
import LoginButton from './components/Login/LoginButton';

const osv_guide_quotes_wp = {
    "nonce": "b19ffcbbfd",
    "post_id": "32607",
    "user": null,
    "user2": {
        "ID": 4,
        "user_id": 4,
        "user_login": "Abraham",
        "user_nicename": "abraham",
        "user_email": "abrahambosch@gmail.com",
        "display_name": "Abraham Bosch"
    },
    "ajaxurl": "https://staging.osv.ltd.uk/wp-admin/admin-ajax.php",
    "resturl": "https://staging.osv.ltd.uk/wp-json/",
    "home_url": "https://staging.osv.ltd.uk",
    "logout_url": "https://staging.osv.ltd.uk/wp-login.php?action=logout&_wpnonce=ef8710cf71",
    "lostPasswordUrl": "https://staging.osv.ltd.uk/wp-login.php?action=lostpassword",
    "loadingmessage": "Sending user info, please wait..."
};


window.osv_guide_quotes_wp = window.osv_guide_quotes_wp?window.osv_guide_quotes_wp:osv_guide_quotes_wp;

function App() {
  return (
    <div className="App" style={{margin: 50}}>
        <nav className="navbar navbar-default">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <div className="nav navbar-nav navbar-right navbar-form">
                        <LoginButton />
                    </div>
                </div>
            </div>
        </nav>

        <div style={{width: 300}}>
            <LoginForm />
        </div>
        <Garage />
        <div style={{width: 300}}>
            <GuideQuotes seomake={'honda'} seomodel={'cr-v-estate'}></GuideQuotes>
        </div>
        <GuideQuotesAdmin></GuideQuotesAdmin>
    </div>
  );
}

export default App;
