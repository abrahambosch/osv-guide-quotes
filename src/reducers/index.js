import { combineReducers } from 'redux';
import garageGuideQuotesReducer from './garageGuideQuotesReducer';
import garageOfficialQuotesReducer from './garageOfficialQuotesReducer';
import selectedGarageGuideQuoteReducer from './selectedGarageGuideQuoteReducer';
import userReducer from './userReducer';

export default combineReducers({
    garageGuideQuotes: garageGuideQuotesReducer,
    garageOfficialQuotes: garageOfficialQuotesReducer,
    user: userReducer,
    selectedGarageGuideQuote: selectedGarageGuideQuoteReducer
});