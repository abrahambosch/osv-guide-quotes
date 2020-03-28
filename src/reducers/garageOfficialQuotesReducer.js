export default (state=[], action) => {
    if (action.type === 'FETCH_GARAGE_OFFICIAL_QUOTES') {
        return action.payload;
    }
    return state;
}