import {
    createStore,
    compose,
    applyMiddleware
} from 'redux';
import rootReducer, {
    initialState
} from '../reducers';

import DevTools from '../../util/devTool';
import thunk from 'redux-thunk';

const enhancer = compose(
    applyMiddleware(thunk),
    DevTools.instrument()
)

const store = createStore(rootReducer, initialState, enhancer);

export default store;
