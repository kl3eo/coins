import {
    combineReducers
} from 'redux';
import {
    routerReducer
} from 'react-router-redux';
import * as app from './app'
import appInitialState from './app';


const rootReducer = combineReducers({
    router: routerReducer,
    ...app
})

export const initialState = {
    app: appInitialState
}
export default rootReducer
