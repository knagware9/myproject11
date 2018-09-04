import { userConstants } from './_constants/user.constants';
import { Service } from '../services/services';
import { toast } from 'react-toastify';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
export const userActions = {
	loginAction,
	addEmployeeAction,
	updateEmployeeListAction,
	getEmployeeHistoryAction,
	transferSubAction
};

/**
 * 
 * @param {Object} userObj 
 */
function loginAction(userObj) {
	return (dispatch) => {
		dispatch(request());
		Service.login(userObj).then(
			(user) => {
				let { token } = user;
				window.sessionStorage.setItem('token', token);
				window.sessionStorage.setItem('auth', JSON.stringify(user));
				dispatch(success(user));
			},
			(error) => {
				dispatch(failure(error));
			}
		);
	};
	function request() {
		return { type: userConstants.LOGIN_REQUEST };
	}
	function success(user) {
		return { type: userConstants.LOGIN_SUCCESS, user };
	}
	function failure(error) {
		return { type: userConstants.LOGIN_FAILURE, error };
	}
}

function updateEmployeeListAction() {
	const user = sessionStorage.getItem('username');
	const org = sessionStorage.getItem('org');
	var orgValue = 1;
	switch (org) {
		case 'org2':
			orgValue = 2;
			break;
		case 'org3':
			orgValue = 3;
			break;
		default:
			orgValue = 1;
			break;
	}
	return (dispatch) => {
		dispatch(request());
		dispatch(showLoading());		
		Service.getEmployeeListService(user, orgValue)
			.then(
				(list) => {
					const { Employees } = { ...list };
					setTimeout(() => {
						dispatch(success(Employees));
						dispatch(hideLoading());
					}, 1000);
				},
				(error) => {
					toast.error('Something is wrong!');
					dispatch(failure(error));
					dispatch(hideLoading());
				}
			)
			.catch((error) => {
				toast.error('Something is wrong!');
				dispatch(failure(error));
				dispatch(hideLoading());
			});
	};
	function request() {
		return { type: userConstants.UPDATE_EMPLOYEE_REQUEST };
	}
	function success(data) {
		return { type: userConstants.UPDATE_EMPLOYEE_SUCCESS, data };
	}
	function failure(error) {
		return { type: userConstants.UPDATE_EMPLOYEE_FAILURE, error };
	}
}

/**
 * 
 * @param {object} employee 
 */
function addEmployeeAction(employee) {
	return (dispatch) => {
		dispatch(request());
		dispatch(showLoading());
		Service.addNewEmployeeService(employee)
			.then(
				(data) => {
					toast.success('New employee successfully added!');
					dispatch(success(data));
					setTimeout(() => {
						dispatch(updateEmployeeListAction());
						dispatch(hideLoading());
					}, 200);
				},
				(error) => {
					toast.error('Something is wrong!');
					dispatch(failure(error));
					dispatch(hideLoading());
				}
			)
			.catch((error) => {
				toast.error('Something is wrong!');
				console.log(error)
				dispatch(failure(error));
			});
	};
	function request() {
		return { type: userConstants.ADD_EMPLOYEE };
	}
	function success(data) {
		return { type: userConstants.ADD_EMPLOYEE_SUCCESS, data };
	}
	function failure(error) {
		return { type: userConstants.ADD_EMPLOYEE_FAILURE, error };
	}
}

function getEmployeeHistoryAction(emp_id) {
	return (dispatch) => {
		dispatch(request());
		dispatch(showLoading());
		Service.getEmployeeHistoryService(emp_id).then(
			(data) => {
				dispatch(success(data));
				dispatch(hideLoading());
			},
			(error) => {
				dispatch(hideLoading());
				toast.error('No data found');
				dispatch(failure(error));
			}
		);
	};
	function request() {
		return { type: userConstants.HISTORY_REQUEST };
	}
	function success(data) {
		return { type: userConstants.HISTORY_SUCCESS, data };
	}
	function failure(error) {
		return { type: userConstants.HISTORY_FAILURE, error };
	}
}

/**
 * 
 * @param {object} data: {fcn: 'transfer', [id, sub, status]}
 */
function transferSubAction(data) {
	return (dispatch) => {
		let rawData = data;
		dispatch(request());
		dispatch(showLoading());
		Service.transferSubService(data).then(
			(data) => {
				setTimeout(() => {
					dispatch(updateEmployeeListAction());
					dispatch(hideLoading());
				}, 200);
				dispatch(success());
				if(rawData.fcn==='transfer'){
					toast.success('Employee successfully Transferred!');

				}else{
					toast.success('Certificate successfully Updated!');
				}
			},
			(error) => {
				dispatch(hideLoading());
				dispatch(failure());
			}
		);
	};

	function request() {
		return { type: userConstants.SUB_SWITCH_REQUEST };
	}
	function success() {
		return { type: userConstants.SUB_SWITCH_SUCCESS };
	}
	function failure(error) {
		return { type: userConstants.SUB_SWITCH_FAILURE, error };
	}
}
