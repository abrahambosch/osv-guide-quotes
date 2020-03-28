import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import GuideQuotesAdmin  from './components/GuideQuotesAdmin/GuideQuotesAdmin';
import GuideQuotes  from './components/GuideQuotes/GuideQuotes';
import Garage  from './components/Garage/Garage';
import * as serviceWorker from './serviceWorker';

import reducers from './reducers'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(reducers, applyMiddleware(thunk));

if (document.getElementById('osv-guide-quotes-admin')) {
    ReactDOM.render(
        <Provider store={store}>
        <GuideQuotesAdmin />
        </Provider>, document.getElementById('osv-guide-quotes-admin'));
}
if (document.getElementById('osv-garage')) {
    ReactDOM.render(
        <Provider store={store}>
            <Garage user_id={window.osv_react_wp.user_id}/>
        </Provider>, document.getElementById('osv-garage'));
}
if (document.getElementById('osv-guide-quotes')) {
    const obj = document.getElementById('osv-guide-quotes');
    ReactDOM.render(
        <Provider store={store}>
            <GuideQuotes seomake={obj.getAttribute('data-seomake')} seomodel={obj.getAttribute('data-seomodel')}/>
        </Provider>, obj);
}
if (document.getElementById('osv-root')) {
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>, document.getElementById('osv-root'));
}

//ReactDOM.render(<App />, document.getElementById('osv-react-root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
