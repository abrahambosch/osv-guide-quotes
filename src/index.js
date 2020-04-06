import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import GuideQuotesAdmin  from './components/GuideQuotesAdmin/GuideQuotesAdmin';
import GuideQuotes  from './components/GuideQuotes/GuideQuotes';
import Garage  from './components/Garage/Garage';
import LoginButton  from './components/Login/LoginButton';
import * as serviceWorker from './serviceWorker';
import reducers from './reducers'
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';



const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        }) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(thunk)
);
const store = createStore(reducers, enhancer);


if (document.getElementById('osv-guide-quotes-admin')) {
    ReactDOM.render(
        <Provider store={store}>
            <GuideQuotesAdmin />
        </Provider>, document.getElementById('osv-guide-quotes-admin'));
}
if (document.getElementById('osv-garage')) {
    ReactDOM.render(
        <Provider store={store}>
            <Garage />
        </Provider>, document.getElementById('osv-garage'));
}
if (document.getElementById('osv-login-button')) {
    ReactDOM.render(
        <Provider store={store}>
            <LoginButton />
        </Provider>, document.getElementById('osv-login-button'));
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


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
