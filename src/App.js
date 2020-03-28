import React from 'react';
import './App.css';
import GuideQuotes from './components/GuideQuotes/GuideQuotes';
import GuideQuotesAdmin from './components/GuideQuotesAdmin/GuideQuotesAdmin';
import VideoSearchApp from './components/VideoSearch/VideoSearchApp';
import ReactDOM from "react-dom";
import Garage from "./components/Garage/Garage";


window.osv_react_wp = {
    user_id: '4'
}

function App() {
  return (
    <div className="App" style={{margin: 50}}>
        <Garage user_id={window.osv_react_wp.user_id}/>
        <div style={{width: 300}}>
            <GuideQuotes seomake={'honda'} seomodel={'cr-v-estate'}></GuideQuotes>
        </div>
        <GuideQuotesAdmin></GuideQuotesAdmin>
    </div>
  );
}

export default App;
