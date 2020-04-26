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
    CREATE_USER_REQUEST,
    CREATE_USER_SUCCESS,
    CREATE_USER_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE
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


export const requestCallback = (name, phone, email, rate_books_id, callback) => async (dispatch, getState) => {
    console.log("action getGarage");
    const user_id = getState().auth.user?getState().auth.user.user_id:"";
    const apiurl = getState().auth.apiurl;
    if (!email && getState().auth.user) email = getState().auth.user.user_email;
    const selectedGarageGuideQuote = getState().selectedGarageGuideQuote;
    if (selectedGarageGuideQuote) {
        rate_books_id = selectedGarageGuideQuote.rate_books_id;
    }
    const garage_items_id = selectedGarageGuideQuote?selectedGarageGuideQuote.id:'';
    const url = apiurl + '/callbackRequests';
    const config = {headers: {'Authorization': 'Bearer ' + getState().auth.authtoken}};
    await axios.post(url, {
        name,
        phone,
        email,
        garage_items_id,
        rate_books_id,
        user_id     // optional
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


export const createUser = (first_name, last_name, phone, email, password, callback) => async (dispatch, getState) => {
    console.log("action createUser", email, password);
    const url = '/wp-admin/admin-ajax.php?action=osvajaxcreateuser'; // use relative url and let proxy take care of it on local.
    const data = {
        username: email,
        password,
        phone,
        email,
        first_name,
        last_name,
        action: 'osvajaxcreateuser',
        secret: window.osv_guide_quotes_wp.nonce
    };
    dispatch({
        type: CREATE_USER_REQUEST,
        payload: { email }
    });
    await axios.post(url, qs.stringify(data), {
        headers: {
            Authorization: getState().auth.basic_auth
        },
        crossdomain: true
    }).then(response => {
        console.log("response from login: ", response);
        if (response.data.status === 'SUCCESS') {
            dispatch({
                type: CREATE_USER_SUCCESS,
                payload: response.data.data.user
            });
            if (callback) callback(null, response.data.data.user);
        }
        else {
            dispatch({
                type: CREATE_USER_FAILURE,
                payload: 'Failure while creating user. Please check the username or password. '
            });
            if (callback) callback('Failure while creating user. Please check the username or password. ');
        }

    }).catch(error => {
        if (error.response) {
            if (error.response.data && error.response.data.error) {
                error = error.response.data.error;
            }
        }
        else {
            error = "Invalid username or password. "
        }
        dispatch({
            type: CREATE_USER_FAILURE,
            payload: error
        });
        if (callback) callback(error);
    });
};

export const updateUser = (first_name, last_name, phone, email, password, callback) => async (dispatch, getState) => {
    console.log("action createUser", email, password);
    const url = '/wp-admin/admin-ajax.php?action=osvajaxupdateuser'; // use relative url and let proxy take care of it on local.
    const data = {
        username: email,
        password,
        phone,
        email,
        first_name,
        last_name,
        action: 'osvajaxupdateuser',
        secret: window.osv_guide_quotes_wp.nonce
    };
    dispatch({
        type: UPDATE_USER_REQUEST,
        payload: { email }
    });
    await axios.post(url, qs.stringify(data), {
        headers: {
            Authorization: getState().auth.basic_auth
        },
        crossdomain: true
    }).then(response => {
        console.log("response from login: ", response);
        if (response.data.status === 'SUCCESS') {
            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: response.data.data.user
            });
            if (callback) callback(null, response.data.data.user);
        }
        else {
            dispatch({
                type: UPDATE_USER_FAILURE,
                payload: 'Failure while creating user. Please check the username or password. '
            });
            if (callback) callback('Failure while creating user. Please check the username or password. ');
        }

    }).catch(error => {
        dispatch({
            type: CREATE_USER_FAILURE,
            payload: 'Create User failed: ' + error
        });
        if (callback) callback('Create User failed: ' + error);
    });
};

export const attemptLogout = () => async (dispatch, getState) => {
    dispatch({type: LOGOUT_SUCCESS});
    window.location.href = getState().auth.logout_url;
};

export const attemptLogin = (username, password, callback) => async (dispatch, getState) => {
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
            if (callback) callback(null, response.data.data.user);
        }
        else {
            dispatch(failure('Invalid username or password '));
            if (callback) callback('Invalid username or password ');
            //throw new SubmissionError({ username: 'User or password is invalid', _error: 'Login failed!' });
        }

    }).catch(error => {
        dispatch(failure('Invalid username or password'));
        if (callback) callback('Invalid username or password ');
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






