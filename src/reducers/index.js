import { combineReducers } from 'redux';
import garageGuideQuotesReducer from './garageGuideQuotesReducer';
import garageOfficialQuotesReducer from './garageOfficialQuotesReducer';
import selectedGarageGuideQuoteReducer from './selectedGarageGuideQuoteReducer';
import callbackRequestsReducer from "./callbackRequestsReducer";
import authReducer from './authReducer';
import { reducer as formReducer } from 'redux-form';

export default combineReducers({
    callbackRequests: callbackRequestsReducer,
    garageGuideQuotes: garageGuideQuotesReducer,
    garageOfficialQuotes: garageOfficialQuotesReducer,
    auth: authReducer,
    selectedGarageGuideQuote: selectedGarageGuideQuoteReducer,
    form: formReducer
});