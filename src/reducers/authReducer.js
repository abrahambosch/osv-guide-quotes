import {
    FETCH_USER,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_SUCCESS,
    CREATE_USER_SUCCESS,
    CREATE_USER_FAILURE
} from '../actions/types';

let api_url = "https://api.osv.ltd.uk";
if (window.location.hostname === 'localhost' || window.location.hostname === 'staging.osv.ltd.uk') {
    api_url = "https://staging-api.osv.ltd.uk";
}

let initialState = {
    user: null,
    isLoggedIn: false,
    loginErrors: null,
    apiurl: api_url,
    ajaxurl: "/wp-admin/admin-ajax.php",
    resturl: "/wp-json/osv_react",
    logout_url: "/wp-login.php?action=logout",
    nonce: "",
    lost_password_url:"/wp-login.php?action=lostpassword"
};
if (window.osv_guide_quotes_wp) {
    if (window.osv_guide_quotes_wp.ajaxurl) {
        initialState.ajaxurl = window.osv_guide_quotes_wp.ajaxurl;
    }
    if (window.osv_guide_quotes_wp.resturl) {
        initialState.resturl = window.osv_guide_quotes_wp.resturl;
    }
    if (window.osv_guide_quotes_wp.nonce) {
        initialState.nonce = window.osv_guide_quotes_wp.nonce;
    }
    if (window.osv_guide_quotes_wp.logout_url) {
        initialState.logout_url = window.osv_guide_quotes_wp.logout_url;
    }
// let user = JSON.parse(localStorage.getItem('user'));
    if (window.osv_guide_quotes_wp.user) {
        initialState.isLoggedIn = true;
        initialState.user = window.osv_guide_quotes_wp.user;
    }
}
else {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        initialState.isLoggedIn = true;
        initialState.user = user;
    }
}

export default (state=initialState, action) => {
    let user = null;
    switch (action.type) {
        case LOGIN_REQUEST:
            return {...state, loginErrors: null};
        case LOGIN_SUCCESS:
        case FETCH_USER:
            user = {...action.payload, user_id:  action.payload.ID};
            localStorage.setItem('user', JSON.stringify(user));
            return {...state, user, isLoggedIn: true, loginErrors: null};
        case CREATE_USER_SUCCESS:
            user = {...action.payload, user_id:  action.payload.ID};
            localStorage.setItem('user', JSON.stringify(user));
            return {...state, user, isLoggedIn: true, loginErrors: null, createUserErrors: null};
        case CREATE_USER_FAILURE:
            return {...state, createUserErrors: action.payload};
        case LOGIN_FAILURE:
            console.log("LOGIN_FAILURE", action.payload);
            return {...state, user: null, isLoggedIn: false, loginErrors: action.payload};
        case LOGOUT_SUCCESS:
            localStorage.removeItem('user');
            return {...state, user: null, isLoggedIn: false, loginErrors: ""};
        default:
            return state;
    }
}