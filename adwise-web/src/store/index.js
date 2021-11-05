import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import {actions, actionTypes} from './actions';
import {rootReducer} from './reducers'

export const setupStore = () => {
    return createStore(rootReducer, {}, applyMiddleware(thunk));
};

export {
    actions,
    actionTypes,
    rootReducer
};