import { FETCH_GARAGE_GUIDE_QUOTES } from '../actions/types'

export default (state=[], action) => {
    if (action.type === FETCH_GARAGE_GUIDE_QUOTES) {
        return action.payload;
    }
    return state;
}