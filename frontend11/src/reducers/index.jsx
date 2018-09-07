import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { loadingBarReducer } from 'react-redux-loading-bar'
import { login, addEmployee, updateEmployeeListReducer, getEmployeeHistory, transferSubReducer } from './user.reducer';
import {modalReducers} from './modal.reducers';
const rootReducer = combineReducers({
	loadingBar: loadingBarReducer,
	routerReducer,
	login,
	addEmployee,
	updateEmployeeListReducer,
	getEmployeeHistory,
	transferSubReducer,
	modalReducers
});

export default rootReducer;
