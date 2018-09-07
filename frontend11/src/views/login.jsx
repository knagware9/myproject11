import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardHeader, CardBody, Button, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import Reveal from 'react-reveal';
import { userActions } from '../actions/user.actions';
import classNames from 'classnames';

class login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			orgName: '',
			error: false
		};
		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.login = this.login.bind(this);
	}

	onChangeHandler(event) {
		const name = event.target.name;
		this.setState({
			[name]: event.target.value
		});
	}

	login() {
		let { username, orgName } = this.state;
		let userOBJ = { username, orgName };
		setTimeout(() => {
			this.props.dispatch(userActions.loginAction(userOBJ));
		}, 100);
		window.sessionStorage.setItem('username', username);
		window.sessionStorage.setItem('org', orgName);
	}

	render() {
		let { username, orgName, error } = this.state;
		let isBlank = username === '' || orgName === '' ? true : false;
		let { doingLogin } = this.props;
		if (this.props.authenticated || window.sessionStorage.getItem('token')) {
			return <Redirect to="/root/employee" />;
		}

		var btnClass = classNames('btn', {
			'btn-loading' : doingLogin
		});

		return (
			<div className="loginBg" style={{ height: '100%' }}>
				<Reveal effect="fadeInSlow">
					<div className="authForm-container d-flex justify-content-center">
						<Card className="shadow-sm card-login align-self-center">
							<CardHeader>Login</CardHeader>
							<CardBody>
								{error && (
									<div className={'text-danger'} style={{ fontSize: '12px', paddingBottom: '10px' }}>
										Email or Password is wrong.
									</div>
								)}
								<Form>
									<FormGroup>
										<Label for="email">Username</Label>
										<Input
											type="email"
											id="email"
											value={this.state.email}
											name="username"
											required
											onChange={this.onChangeHandler}
										/>
									</FormGroup>
									<FormGroup>
										<Label for="password">Organization</Label>
										<Input
											type="text"
											id="password"
											value={this.state.password}
											name="orgName"
											required
											onChange={this.onChangeHandler}
										/>
									</FormGroup>
									<Row>
										<Col sm="8">
											<FormGroup check>
												<Label check>
													<Input type="checkbox" /> Remember me
												</Label>
											</FormGroup>
										</Col>
										<p className="d-block d-sm-none col-sm-12" />
										<Col sm="4">
											<FormGroup>
												<Button
													disabled={isBlank}
													block
													color="primary"
													type="button"
													onClick={this.login}
													className={btnClass}
												>
													Login
												</Button>
											</FormGroup>
										</Col>
									</Row>
								</Form>
							</CardBody>
						</Card>
					</div>
				</Reveal>
			</div>
		);
	}
}

login.propTypes = {
	doingLogin: PropTypes.bool
};

const mapStateToProps = (state) => {
	const { doingLogin, authenticated } = state.login;
	return {
		doingLogin,
		authenticated
	};
};

export default connect(mapStateToProps)(login);
