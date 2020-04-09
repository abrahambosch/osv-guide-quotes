// import _ from 'lodash';
import axios from "axios";
import qs from 'qs';
//import { SubmissionError } from 'redux-form'
import {
    FETCH_USER,
    DESELECT_GARAGE_GUIDE_QUOTE,
    SELECT_GARAGE_GUIDE_QUOTE,
    CALLBACK_REQUEST,
    CALLBACK_REQUESTS,
    FETCH_GARAGE_GUIDE_QUOTES,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_SUCCESS,
    CREATE_USER_SUCCESS,
    CREATE_USER_FAILURE
} from './types';

console.log("process.env object", process.env);
console.log("process cwd", process.cwd());

export const getGarageItems = () => async (dispatch, getState) => {
    console.log("action getGarage");
    if (!getState().auth.user) return;
    const user_id = getState().auth.user.user_id;
    const apiurl = getState().auth.apiurl;
    const url = apiurl + '/garages/' + user_id;
    const config = {headers: {'Authorization': 'Bearer ' + getState().auth.authtoken}};
    axios.get(url, config).then(response => {
        dispatch({
            type: FETCH_GARAGE_GUIDE_QUOTES,
            payload: response.data.data.garageItems
        });
    });
};

export const callbackRequests = () => async (dispatch, getState) => {
    console.log("action getGarage");
    const user_id = getState().auth.user.user_id;
    const apiurl = getState().auth.apiurl;
    const url = apiurl + '/garages/' + user_id + '/callbackRequests';
    const config = {headers: {'Authorization': 'Bearer ' + getState().auth.authtoken}};
    await axios.get(url, config).then(response => {
        dispatch({
            type: CALLBACK_REQUESTS,
            payload: response.data.data
        });
    });
};


export const requestCallback = (name, phone, rate_books_id, callback) => async (dispatch, getState) => {
    console.log("action getGarage");
    const user_id = getState().auth.user.user_id;
    const apiurl = getState().auth.apiurl;
    const selectedGarageGuideQuote = getState().selectedGarageGuideQuote;
    if (selectedGarageGuideQuote) {
        rate_books_id = selectedGarageGuideQuote.rate_books_id;
    }
    const garage_items_id = selectedGarageGuideQuote?selectedGarageGuideQuote.id:'';
    const url = apiurl + '/garages/' + user_id + '/callbackRequests';
    const config = {headers: {'Authorization': 'Bearer ' + getState().auth.authtoken}};
    await axios.post(url, {
        name,
        phone,
        garage_items_id,
        rate_books_id
    }, config).then(response => {
        dispatch({
            type: CALLBACK_REQUEST,
            payload: response.data.data
        });
        if (callback) callback(null, response);
    });
};

export const selectGarageGuideQuote = (guideQuote) =>  {
    console.log("action selectGarageGuideQuote", guideQuote);
   return {
        type: SELECT_GARAGE_GUIDE_QUOTE,
        payload: guideQuote
   };
};

export const deselectGarageGuideQuote = () =>  {
    console.log("action deselectGarageGuideQuote");
    return {
        type: DESELECT_GARAGE_GUIDE_QUOTE
    };
};


export const getUser = () => {
    let user = window.osv_guide_quotes_wp.user?window.osv_guide_quotes_wp.user:null
  return {
      type: FETCH_USER,
      payload: user
  }
};

export const createUser = (name, phone, email, password, callback) => async (dispatch, getState) => {
    phone = phone.replace(/[^0-9]/g, "");
    let data = {name, phone, email, password};
    const apiurl = getState().auth.apiurl;
    console.log("creating account: ", data);
    const config = {headers: {'Authorization': 'Bearer ' + getState().auth.authtoken}};
    return axios.post(apiurl + '/wpusers', data, config).then((response) => {
        console.log(response);
        if (response.data.data.user) {
            dispatch({ type: CREATE_USER_SUCCESS, payload: response.data.data.user });
            if (callback) {
                callback(null, response.data.data.user);
            }
        }
    }).catch((error) => {
        console.log(error);
        dispatch({ type: CREATE_USER_FAILURE, payload: error });
        if (callback) {
            callback(error);
        }
    });
};

export const attemptLogout = () => async (dispatch, getState) => {
    dispatch({type: LOGOUT_SUCCESS});
    window.location.href = getState().auth.logout_url;
};

export const attemptLogin = (username, password) => async (dispatch, getState) => {
    console.log("action attemptLogin", username, password);
    const url = '/wp-admin/admin-ajax.php?action=osvajaxlogin'; // use relative url and let proxy take care of it on local.
    const data = {
        username,
        password,
        action: 'osvajaxlogin',
        secret: window.osv_guide_quotes_wp.nonce
    };
    dispatch(request({ username }));
    await axios.post(url, qs.stringify(data), {
        headers: {
            Authorization: getState().auth.basic_auth
        },
        crossdomain: true
    }).then(response => {
        console.log("response from login: ", response);
        if (response.data.status === 'SUCCESS') {
            dispatch(success(response.data.data.user));
        }
        else {
            dispatch(failure('Invalid username or password '));
            //throw new SubmissionError({ username: 'User or password is invalid', _error: 'Login failed!' });
        }

    }).catch(error => {
        dispatch(failure('Login failed: ' + error));
        //throw new SubmissionError({ username: 'User or password is invalid', _error: 'Login failed!' + error })
    });

    function request(user) { return { type: LOGIN_REQUEST, payload: user } }
    function success(user) { return { type: LOGIN_SUCCESS, payload: user } }
    function failure(error) { return { type: LOGIN_FAILURE, payload: error } }
};


export const createGarageItem = (user_id, seomake, seomodel, rateBookId, callback) => async (dispatch, getState) => {
    let data = {seomake, seomodel, rateBookId};
    console.log("submitting quote: ", data);
    //const user_id = getState().auth.user.user_id;
    const apiurl = getState().auth.apiurl;
    const config = {headers: {'Authorization': 'Bearer ' + getState().auth.authtoken}};
    return axios.post(apiurl + '/garages/'+user_id+ '/addVehicle', data, config).then((response) => {
        console.log(response);
        if (response.data.data.garageItems) {
            dispatch({
                type: FETCH_GARAGE_GUIDE_QUOTES,
                payload: response.data.data.garageItems
            });

            if (callback) {
                callback(null, response);
            }
        }
        else {
            if (callback) {
                callback("Error fetching garage items. ");
            }
        }
    }).catch((error) => {
        console.log(error);
        if (callback) {
            callback(error);
        }
    });
};






export const removeGarageItem = (garageItem, callback) => async (dispatch, getState) => {
    console.log("submitting quote: ", garageItem);
    const user_id = getState().auth.user.user_id;
    const apiurl = getState().auth.apiurl;
    const config = {headers: {'Authorization': 'Bearer ' + getState().auth.authtoken}};
    return axios.delete(apiurl + '/garages/'+user_id+ '/garageItems/'+garageItem.id, config).then((response) => {
        console.log(response);
        if (response.data.data.garageItems) {
            dispatch({
                type: FETCH_GARAGE_GUIDE_QUOTES,
                payload: response.data.data.garageItems
            });

            if (callback) {
                callback(null, response);
            }
        }
        else {
            if (callback) {
                callback("Error deleting garage items. ");
            }
        }
    }).catch((error) => {
        console.log(error);
        if (callback) {
            callback(error);
        }
    });
};






