// import _ from 'lodash';
import axios from "axios";

let api_url = "https://api.osv.ltd.uk";
if (window.location.hostname === 'localhost' || window.location.hostname === 'staging.osv.ltd.uk') {
    api_url = "https://staging-api.osv.ltd.uk";
}

export const getGarageItems = (user_id) => async (dispatch, getState) => {
    console.log("action getGarage");
    const url = api_url + '/garages/' + user_id;
    axios.get(url).then(response => {
        dispatch({
            type: 'FETCH_GARAGE_GUIDE_QUOTES',
            payload: response.data.data.garageItems
        });
    });
};

export const requestCallback = (user_id, name, phone) => async (dispatch, getState) => {
    console.log("action getGarage");
    const url = api_url + '/garages/' + user_id + '/requestCallback';
    axios.get(url).then(response => {
        dispatch({
            type: 'REQUEST_CALLBACK',
            payload: response.data.data
        });
    });
};

export const selectGarageGuideQuote = (guideQuote) =>  {
    console.log("action selectGarageGuideQuote", guideQuote);
   return {
        type: 'SELECT_GARAGE_GUIDE_QUOTE',
        payload: guideQuote
   };
};

export const deselectGarageGuideQuote = () =>  {
    console.log("action deselectGarageGuideQuote");
    return {
        type: 'DESELECT_GARAGE_GUIDE_QUOTE'
    };
};




