import React, { Component } from 'react';
import './app.css';

import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Layout from './components/layout/layout';
import Login from './views/login';
import { Provider } from 'react-redux';
import Store, { history } from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import ModalConductor from "./containers/ModalConductor";
class App extends Component {
	render() {
		return (
			<div style={{ height: ' 100%' }}>
				<Provider store={Store} history={history}>
					<div style={{height: '100%'}}>
					<Router>
						<Switch>
							<Redirect to="/" from="/login" />
							<Route exact path="/" component={Login} />
							<PrivateRoute path="/root" component={Layout} />
							<Route
								render={({ location }) => (
									<div>
										No match for <code>{location.pathname}</code>
									</div>
								)}
							/>
						</Switch>
					</Router>
					<ModalConductor/>
					</div>
				</Provider>
				<ToastContainer position="bottom-center" autoClose={2500} hideProgressBar/>
			</div>
		);
	}
}

export default App;

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			window.sessionStorage.getItem('token') ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: '/',
						state: { from: props.location }
					}}
				/>
			)}
	/>
);
