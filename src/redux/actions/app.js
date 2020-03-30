import {
    LOADING_STATUS,
    MARKETPAIR_UPDATED,

} from '../actionTypes'

export function changeLoadingStatus(status) {
    return {
        type: LOADING_STATUS,
        loading: status
    }
}


export const marketPairDataUpdated = (dataA, dataB) => {
    return (dispatch) => {
        dispatch({
            type: MARKETPAIR_UPDATED,
            marketPairListA: dataA,
	    marketPairListB: dataB
        })
    }
}

export default {
     changeLoadingStatus, marketPairDataUpdated
}
