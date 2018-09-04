import React, { Component } from 'react';
import './layout.css';
import Header from '../header/header';
import Footer from '../footer/footer';
import Employee from '../../views/employee/employee';
import History from '../../views/history';

import { Route, Switch } from 'react-router-dom';

class layout extends Component {
	render() {
		const { match } = this.props;
		return (
			<main className={'main'}>
				<div className="main_row align-top">
					<div className="main_cell">
						<Header match={match} />
					</div>
				</div>
				<div className="main_row align-top">
					<div className="main_cell">
						<section className={'wrapper'}>
							<Switch
								atEnter={{ opacity: 0 }}
								atLeave={{ opacity: 0 }}
								atActive={{ opacity: 1 }}
								className="switch-wrapper"
							>
								<Route path={`${match.url}/employee`} render={(props) => <Employee {...props} />} />
								<Route path={`${match.url}/history`} component={History} />
								<Route
									render={({ location }) => (
										<div>
											No match for <code>{location.pathname}</code>
										</div>
									)}
								/>
							</Switch>
						</section>
					</div>
				</div>
				<div className="main_row align-bottom">
					<div className="main_cell">
						<Footer />
					</div>
				</div>
			</main>
		);
	}
}

export default layout;
