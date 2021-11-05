import { combineReducers } from 'redux';

import app from '../AppState';
import company from '../pages/CompanyPages/MainScreen/MainScreenState';

const rootReducer = combineReducers({
    app,
    company
});

export default rootReducer
