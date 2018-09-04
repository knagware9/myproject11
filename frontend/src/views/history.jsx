import React, { Component } from 'react';
import Nodata from '../components/nodata/nodata';
import { Container, Col, Row, InputGroup, InputGroupAddon, Input, Button, Table, Card, CardHeader } from 'reactstrap';
import { dateTimeFormate } from '../utilities/utils';
import { connect } from 'react-redux';
import { userActions } from '../actions/user.actions';
import Icon from '../components/icon/icon';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import Reveal from 'react-reveal';
import { sortArrTimeDesc } from '../utilities/utils';
import { userConstants } from '../actions/_constants/user.constants';

class history extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchId: '',
			data: []
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.changeHandle = this.changeHandle.bind(this);
		this.SearchtextInput = React.createRef();
	}
	changeHandle(event) {
		const name = event.target.name;
		this.setState({
			[name]: event.target.value
		});
	}
	handleSubmit() {
		let { searchId } = this.state;
		if (searchId !== '') {
			this.props.dispatch(userActions.getEmployeeHistoryAction(searchId));
		} else {
			toast.info('Please insert an employee id');
			this.SearchtextInput.current.focus();
		}
	}

	componentWillUnmount() {
		this.props.dispatch({ type: userConstants.HISTORY_CLEAR });
	}

	render() {
		let { searchId } = this.state;
		let { payload, getting_history } = this.props;
		let view;
		let isdata = payload !== undefined && payload.length !== 0 ? true : false;
		if (isdata) {
			let reverseSortedData = sortArrTimeDesc(payload, 'Timestamp');
			view = reverseSortedData.map((item, i) => {
				let { Value, Timestamp } = item;
				let time = dateTimeFormate(new Date(Timestamp), 12);

				let statusClass = classNames({
					'text-success': item.Value.status === 'Active',
					'text-danger': item.Value.status === 'Inactive'
				});
				return (
					<tr key={i}>
						<td>{time}</td>
						<td>{Value.boeingsub}</td>
						<td>{Value.certdate}</td>
						<td>{Value.certification}</td>
						<td>{Value.designation}</td>
						<td>{Value.division}</td>
						<td>{Value.nationality}</td>
						<td className={statusClass}>{Value.status}</td>
					</tr>
				);
			});
		}
		return (
			<div>
				<Reveal effect="fadeInSlow">
					<Container>
						<Row className="mb-3">
							<Col md={{ size: 6, offset: 3 }}>
								<InputGroup>
									<Input
										value={searchId}
										innerRef={this.SearchtextInput}
										name="searchId"
										onChange={this.changeHandle}
									/>
									<InputGroupAddon addonType="append">
										<Button type="button" onClick={this.handleSubmit}>
											<Icon icn="search" /> Search
										</Button>
									</InputGroupAddon>
								</InputGroup>
							</Col>
						</Row>

						<Row>
							<Col>
								{isdata && (
									<Card className="shadow-sm">
										<CardHeader>
											{payload[0].Value.name},{' '}
											<small className="text-muted">ID: {payload[0].Value.empid}</small>
										</CardHeader>
										<Table bordered striped className="mb-0">
											<thead>
												<tr>
													<th>
														Updated On <small className="text-muted">UST</small>
													</th>
													<th>boeing sub</th>
													<th>cert date</th>
													<th>certification</th>
													<th>designation</th>
													<th>division</th>
													<th>nationality</th>
													<th>status</th>
												</tr>
											</thead>
											<tbody>{view}</tbody>
										</Table>
									</Card>
								)}
								{!isdata &&
								!getting_history && (
									<Row>
										<Col sm={{ size: 6, offset: 3 }}>
											<Nodata />
										</Col>
									</Row>
								)}
							</Col>
						</Row>
					</Container>
				</Reveal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { getting_history, payload } = state.getEmployeeHistory;
	return {
		getting_history,
		payload
	};
};

export default connect(mapStateToProps)(history);
