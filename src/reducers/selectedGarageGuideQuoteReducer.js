import { SELECT_GARAGE_GUIDE_QUOTE, DESELECT_GARAGE_GUIDE_QUOTE } from '../actions/types'

export default (state= null, action) => {
    if (action.type === SELECT_GARAGE_GUIDE_QUOTE) {
        return action.payload;
    }
    if (action.type === DESELECT_GARAGE_GUIDE_QUOTE) {
        return null;
    }
    return state;
}