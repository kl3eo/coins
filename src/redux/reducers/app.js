import { handleActions } from 'redux-actions'

const initialState = {
    loading: false,
    marketPairListA: [],
    marketPairListB: []
}

export const app = handleActions({

    MARKETPAIR_UPDATED(state, action) {
        return {
            ...state,
            marketPairListA: action.marketPairListA,
	    marketPairListB: action.marketPairListB
        }
    }    
}, initialState);


export default {
    ...initialState
};
