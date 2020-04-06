import {CALLBACK_REQUEST, CALLBACK_REQUESTS} from '../actions/types'

export default (state=[], action) => {
    if (action.type === CALLBACK_REQUEST) {
        return [...state, action.payload];
    }
    if (action.type === CALLBACK_REQUESTS) {
        return action.payload;
    }
    return state;
}