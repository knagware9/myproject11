export const Service = {
	login,
	getEmployeeListService,
	addNewEmployeeService,
	getEmployeeHistoryService,
	transferSubService
};

const Base_Api = process.env.REACT_APP_BASE_API_URL;
function login(user) {
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(user)
	};
	return fetch(`${Base_Api}users`, requestOptions).then(handleResponse);
}

function getEmployeeListService(user, org) {
	let token = sessionStorage.getItem('token');
	return fetch(
		`${Base_Api}channels/mgrchannel/chaincodes/mycc?peer=peer${org}&fcn=getAllSubsidEmployees&args=%5B%22${user}%22%5D`,
		{
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			}
		}
	).then(handleResponse);
}

function addNewEmployeeService(employee) {
	let token = sessionStorage.getItem('token');
	return fetch(`${Base_Api}channels/mgrchannel/chaincodes/mycc`, {
		method: 'POST',
		headers: {
			Authorization: 'Bearer ' + token
		},
		body: employee
	}).then(handleResponse);
}


function getEmployeeHistoryService(id) {
	let token = sessionStorage.getItem('token');
	return fetch(
		`${Base_Api}channels/mgrchannel/chaincodes/mycc?peer=peer1&fcn=getemployeehistory&args=%5B%22${id}%22%5D`,
		{
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			}
		}
	).then(handleResponse);
}

function transferSubService(data) {
	let token = sessionStorage.getItem('token');
	return fetch(`${Base_Api}channels/mgrchannel/chaincodes/mycc`, {
		method: 'POST',
		headers: {
			Authorization: 'Bearer ' + token,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}).then(handleResponse);
}

function handleResponse(response) {
	if (!response.ok) {
		return Promise.reject(response);
	}
	return response.json();
}
