import { userConstants } from '../actions/_constants/user.constants';

export function login(state = {}, action) {
	switch (action.type) {
		case userConstants.LOGIN_REQUEST:
			return { doingLogin: true };
		case userConstants.LOGIN_SUCCESS:
			return {
				authenticated: true,
				doingLogin: false
			};
		case userConstants.LOGIN_FAILURE:
			return {};
		default:
			return state;
	}
}

export function logout(state = {}, action) {
	switch (action.type) {
		case userConstants.LOGOUT:
			return { doingLogout: true };
		case userConstants.LOGOUT_SUCCESS:
			return {
				authenticated: false,
				doingLogout: false
			};
		default:
			return state;
	}
}

export function addEmployee(state = {}, action) {
	switch (action.type) {
		case userConstants.ADD_EMPLOYEE:
			return { isSubmitting: true };
		case userConstants.ADD_EMPLOYEE_SUCCESS:
			return { isSubmitting: false, added: true };
		case userConstants.ADD_EMPLOYEE_FAILURE:
			return { isSubmitting: false };
		default:
			return state;
	}
}

export function updateEmployeeListReducer(state = {}, action) {
	switch (action.type) {
		case userConstants.UPDATE_EMPLOYEE_REQUEST:
			return { list_updating: true };
		case userConstants.UPDATE_EMPLOYEE_SUCCESS:
			return { list_updating: false, payload: action.data };
		case userConstants.UPDATE_EMPLOYEE_FAILURE:
			return { list_updating: false };
		default:
			return state;
	}
}
export function getEmployeeHistory(state = {}, action) {
	switch (action.type) {
		case userConstants.HISTORY_REQUEST:
			return { getting_history: true };
		case userConstants.HISTORY_SUCCESS:
			return { getting_history: false, payload: action.data };
		case userConstants.HISTORY_FAILURE:
			return { getting_history: false };
		case userConstants.HISTORY_CLEAR:
			return {};
		default:
			return state;
	}
}

export function transferSubReducer(state = {}, action) {
	switch (action.type) {
		case userConstants.SUB_SWITCH_REQUEST:
			return { switching: true, transferred: false };
		case userConstants.SUB_SWITCH_SUCCESS:
			return { switching: false, transferred: true };
		case userConstants.SUB_SWITCH_FAILURE:
			return { switching: false };
		default:
			return state;
	}
}
