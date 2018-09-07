import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, Form, Input, FormGroup, Label, Button } from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { modalActions } from '../../actions/modal.actions';
import { userActions } from '../../actions/user.actions';
import classNames from 'classnames';

class Certificateswitch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalOpen: false,
			data: [],
			selectedEmp: '',
			empCertificate: '',
			empCertificateDate: moment(),
			isInputDiesabled: true
		};
		this.handelCertdate = this.handelCertdate.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.selectChangeHandler = this.selectChangeHandler.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentDidMount() {
		this.setState({
			data: this.props.payload,
			isModalOpen: this.props.isopen
		});
	}
	handleClose() {
		this.setState({
			data: [],
			isModalOpen: false
		});
	}
	onClosed() {
		this.props.dispatch(modalActions.CloseModal());
	}
	handelCertdate(date) {
		this.setState({
			empCertificateDate: date
		});
	}
	handleChange(event) {
		this.setState({
			empCertificate: event.target.value
		});
	}
	handleSubmit() {
		let { selectedEmp, empCertificate, empCertificateDate } = this.state;
		let toBeSubmited = {
			fcn: 'update',
			args: [ selectedEmp, empCertificate, empCertificateDate.format('MM-DD-YYYY') ]
		};
		this.props.dispatch(userActions.transferSubAction(toBeSubmited));
	}
	selectChangeHandler(e) {
		let { data } = this.state;
		let id = e.target.value;
		if (id !== '-1') {
			data.forEach((item) => {
				if (item.empid === id) {
					this.setState({
						selectedEmp: item.empid,
						empCertificate: item.certification,
						empCertificateDate: moment(item.certdate),
						isInputDiesabled: false
					});
				}
			});
		} else {
			this.setState({
				empCertificate: '',
				empCertificateDate: moment(),
				isInputDiesabled: true
			});
		}
    }
    componentWillReceiveProps(nexprops){
        let {switching} = nexprops
        if(!switching){
            this.handleClose();
        }
    }
	render() {
		let { data, empCertificate, empCertificateDate, isInputDiesabled, isModalOpen } = this.state;
        let { switching } = this.props;
        let btnClasses = classNames({
            'btn-loading': switching
        })
		return (
			<Modal isOpen={isModalOpen} toggle={this.handleClose} onClosed={this.onClosed.bind(this)}>
				<ModalHeader toggle={this.handleClose}>Update Certifications</ModalHeader>
				<ModalBody>
					<Form>
						<FormGroup>
							<Input type="select" onChange={this.selectChangeHandler}>
								<option value="-1">Please select a user</option>
								{data &&
									data.map((opt) => {
										return (
											<option key={opt.empid} value={opt.empid}>
												{opt.name}
											</option>
										);
									})}
							</Input>
						</FormGroup>
						<FormGroup>
							<Label for="certificate">Certification Date</Label>
							<Input
								id="certificate"
								onChange={this.handleChange}
								type="text"
								value={empCertificate}
								disabled={isInputDiesabled}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="cert_date">Certification Date</Label>
							<DatePicker
								id="cert_date"
								onChange={this.handelCertdate}
								className="form-control"
								selected={empCertificateDate}
								showYearDropdown={true}
								disabled={isInputDiesabled}
							/>
						</FormGroup>
						<div className="text-center">
							<Button color="success" className={btnClasses} type="button" onClick={this.handleSubmit}>
								Submit
							</Button>
							<Button color="default" onClick={this.handleClose} type="button" className="ml-2">
								Cancel
							</Button>
						</div>
					</Form>
				</ModalBody>
			</Modal>
		);
	}
}

Certificateswitch.propTypes = {
	payload: PropTypes.array.isRequired,
	isopen: PropTypes.bool
};

export default Certificateswitch;
