import React, { Component } from 'react';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import { connect } from 'react-redux';
import { userActions } from '../../actions/user.actions';

import {
	Row,
	Col,
	Card,
	CardBody,
	CardHeader,
	Fade,
	FormGroup,
	Label,
	Input,
	Form,
	CustomInput,
	Button,
	InputGroup,
	InputGroupAddon
} from 'reactstrap';
import classNames from 'classnames';

class adduser extends Component {
	constructor(props) {
		super(props);

		this.state = {
			user: {
				Dob: moment(),
				Doj: moment(),
				firstname: '',
				lastname: '',
				Boeingsub: window.sessionStorage.getItem('username'),
				Division: '',
				Designation: '',
				Certification: '',
				Certdate: moment(),
				Nationality: '',
				Yearofexp: '',
				Certificate: ''
			},
			Certifilehash: []
		};
		this.handleChange = this.handleChange.bind(this);
		this.handelDOB = this.handelDOB.bind(this);
		this.handelDOJ = this.handelDOJ.bind(this);
		this.handelCertdate = this.handelCertdate.bind(this);
		this.filehandleChange = this.filehandleChange.bind(this);
		this.handelSubmit = this.handelSubmit.bind(this);
	}

	handleChange(event) {
		const name = event.target.name;
		const { user } = this.state;
		user[name] = event.target.value;
		this.setState({
			user
		});
	}
	handelDOB(date) {
		const { user } = this.state;
		user['Dob'] = date;
		this.setState({
			user
		});
	}
	handelDOJ(date) {
		const { user } = this.state;
		user['Doj'] = date;
		this.setState({
			user
		});
	}
	handelCertdate(date) {
		const { user } = this.state;
		user['Certdate'] = date;
		this.setState({
			user
		});
	}
	filehandleChange(e) {
		e.preventDefault();
		const { user } = this.state;
		user['Certificate'] = e.target.value;
		this.setState({
			user,
			Certifilehash: e.target.files[0]
		});
	}
	handelSubmit(e) {
		e.preventDefault();
		let {
			firstname,
			lastname,
			Boeingsub,
			Division,
			Designation,
			Certification,
			Certdate,
			Nationality,
			Yearofexp,
			Dob,
			Doj,
			Gender,
			Status
		} = this.state.user;

		let { Certifilehash } = this.state;
		var fileData = new FormData();

		let temp_args = [
			{
				fcn: 'onboard',
				args: {
					empid: '',
					name: `${firstname} ${lastname}`,
					dob: Dob.format('MM-DD-YYYY'),
					gender: Gender,
					nationality: Nationality,
					doj: Doj.format('MM-DD-YYYY'),
					designation: Designation,
					division: Division,
					boeingsub: Boeingsub,
					certification: Certification,
					certdate: Certdate.format('MM-DD-YYYY'),
					yearofexp: Yearofexp,
					status: Status
				}
			}
		];

		fileData.append('data', JSON.stringify(temp_args));
		fileData.append('file', Certifilehash);

		this.props.dispatch(userActions.addEmployeeAction(fileData));

		let Blankuser = {
			Dob: moment(),
			Doj: moment(),
			firstname: '',
			lastname: '',
			Boeingsub: window.sessionStorage.getItem('username'),
			Division: '',
			Designation: '',
			Certification: '',
			Certdate: moment(),
			Nationality: '',
			Yearofexp: '',
			Certificate: ''
		};
		this.setState({
			user: Blankuser,
			Certifilehash: {}
		});
	}

	render() {
		let {
			firstname,
			lastname,
			Boeingsub,
			Division,
			Designation,
			Certification,
			Certdate,
			Nationality,
			Yearofexp,
			Dob,
			Doj,
			Certificate
		} = this.state.user;
		let { isSubmitting } = this.props;

		var submit_btnClass = classNames('btn', {
			'btn-loading': isSubmitting
		});
		return (
			<Fade>
				<Card className="shadow-sm">
					<CardHeader>Add New Employee Form</CardHeader>
					<CardBody>
						<Form name="adduserForm" onSubmit={this.handelSubmit}>
							<Row>
								<Col sm="3">
									<FormGroup>
										<Label for="firstname">First Name</Label>
										<Input
											type="text"
											name="firstname"
											id="firstname"
											value={firstname}
											onChange={this.handleChange}
										/>
									</FormGroup>
								</Col>
								<Col sm="3">
									<FormGroup>
										<Label for="lastname">Last Name</Label>
										<Input
											type="text"
											name="lastname"
											id="lastname"
											onChange={this.handleChange}
											value={lastname}
										/>
									</FormGroup>
								</Col>
								<Col sm="3">
									<FormGroup>
										<Label for="boeingsub">Boeing Sub</Label>
										<Input
											type="select"
											value={Boeingsub}
											name="Boeingsub"
											id="boeingsub"
											onChange={this.handleChange}
										>
											<option>Please Select</option>
											<option value="BoeingUS">Boeing USA</option>
											<option value="BoeingUK">Boeing UK</option>
											<option value="BoeingIN">Boeing India</option>
										</Input>
									</FormGroup>
								</Col>
								<Col sm="3">
									<FormGroup>
										<Label for="division">Division</Label>
										<Input
											type="text"
											name="Division"
											value={Division}
											id="division"
											onChange={this.handleChange}
										/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col sm="3">
									<FormGroup>
										<Label for="designation">Designation</Label>
										<Input
											type="text"
											name="Designation"
											id="designation"
											value={Designation}
											onChange={this.handleChange}
										/>
									</FormGroup>
								</Col>
								<Col sm="3">
									<FormGroup>
										<Label for="certification">Certification</Label>
										<Input
											type="text"
											name="Certification"
											value={Certification}
											id="certification"
											onChange={this.handleChange}
										/>
									</FormGroup>
								</Col>
								<Col sm="3">
									<FormGroup>
										<Label for="cert_date">Certification Date</Label>
										<DatePicker
											onChange={this.handelCertdate}
											className="form-control"
											selected={Certdate}
											id="Dob"
											showYearDropdown={true}
										/>
									</FormGroup>
								</Col>
								<Col sm="3">
									<FormGroup>
										<Label for="Certificate">Upload Certificate</Label>
										<InputGroup>
											<InputGroupAddon addonType="prepend">
												<Button>Choose File</Button>
											</InputGroupAddon>
											<Input value={this.state.Certifilehash.name}/>
										</InputGroup>
										<Input
											className="form-control"
											type="file"
											name="Certificate"
											value={Certificate}
											id="Certificate"
											onChange={this.filehandleChange}
										/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col sm="3">
									<FormGroup>
										<Label for="Dob">Date of Birth</Label>
										<DatePicker
											onChange={this.handelDOB}
											className="form-control"
											selected={Dob}
											id="Dob"
											showYearDropdown={true}
										/>
									</FormGroup>
								</Col>
								<Col sm="3">
									<div>
										<Label>Gender</Label>
									</div>
									<FormGroup>
										<CustomInput
											inline
											type="radio"
											id="male"
											name="Gender"
											label="Male"
											onChange={this.handleChange}
											value="Male"
										/>
										<CustomInput
											inline
											type="radio"
											id="female"
											name="Gender"
											label="Female"
											onChange={this.handleChange}
											value="Female"
										/>
									</FormGroup>
								</Col>
								<Col sm="3">
									<FormGroup>
										<Label for="doj">Date of Joining</Label>
										<DatePicker
											onChange={this.handelDOJ}
											className="form-control"
											selected={Doj}
											id="doj"
											showYearDropdown={true}
										/>
									</FormGroup>
								</Col>
								<Col sm="3">
									<FormGroup>
										<Label for="nationality">Nationality</Label>
										<Input
											type="text"
											name="Nationality"
											id="nationality"
											value={Nationality}
											onChange={this.handleChange}
										/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col sm="3">
									<FormGroup>
										<Label for="yoe">Experience</Label>
										<Input
											type="text"
											name="Yearofexp"
											id="yoe"
											onChange={this.handleChange}
											value={Yearofexp}
										/>
									</FormGroup>
								</Col>
								<Col sm="3">
									<div>
										<Label>Status</Label>
									</div>
									<FormGroup>
										<CustomInput
											inline
											type="radio"
											id="active"
											name="Status"
											label="Active"
											onChange={this.handleChange}
											value="Active"
										/>
										<CustomInput
											inline
											type="radio"
											id="inactive"
											name="Status"
											label="Inactive"
											onChange={this.handleChange}
											value="Inactive"
										/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col className="text-right">
									<Button
										type="submit"
										style={{ width: '80px' }}
										color="primary"
										className={submit_btnClass}
									>
										Add
									</Button>
								</Col>
							</Row>
						</Form>
					</CardBody>
				</Card>
			</Fade>
		);
	}
}

const mapStateToProps = (state) => {
	const { isSubmitting, added } = state.addEmployee;
	return {
		isSubmitting,
		added
	};
};

export default connect(mapStateToProps)(adduser);
