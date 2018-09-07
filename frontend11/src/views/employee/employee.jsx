import React, { PureComponent } from 'react';
import {
	Container,
	Table,
	Button,
	Row,
	Col,
	Input,
	Modal,
	ModalHeader,
	ModalBody,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	UncontrolledDropdown
} from 'reactstrap';
import Nodata from '../../components/nodata/nodata';
import Reveal from 'react-reveal';
import Loadable from 'react-loadable';
import Icon from '../../components/icon/icon';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { userActions } from '../../actions/user.actions';
import { modalConstants } from '../../actions/_constants/modal.constants';
import { modalActions } from '../../actions/modal.actions';
import Loading from '../../components/Loader';

const Adduserform = Loadable({
	loader: () => import('./adduser'),
	loading: Loading,
	delay: 300
});

class employee extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			empList: [],
			modal: false,
			selectedUser: {},
			showBar: false,
			dropdownOpen: false,
			confirmationModal: false,
			certificatModal: false,
			cert: '',
			certDate: ''
		};
		this.showUserDetail = this.showUserDetail.bind(this);
		this.Modaltoggle = this.Modaltoggle.bind(this);
		this.toggle = this.toggle.bind(this);
		this.callTransferSub = this.callTransferSub.bind(this);
		this.certificationUpdate = this.certificationUpdate.bind(this);
	}

	Modaltoggle(modalName) {
		this.setState({
			[modalName]: !this.state[modalName]
		});
	}
	showUserDetail(id, e) {
		e.preventDefault();
		let { payload } = this.props;
		payload.forEach((item) => {
			if (item.empid === id) {
				this.setState(
					{
						selectedUser: item
					},
					() => {
						this.Modaltoggle('modal');
					}
				);
			}
		});
	}
	addFormToggle = () => {
		this.setState({ showBar: !this.state.showBar });
	};

	componentDidMount() {
		let { payload } = this.props;
		if (payload === undefined || payload === null) {
			this.props.dispatch(userActions.updateEmployeeListAction());
		}
	}
	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}

	/** 
	*
	* @param {string} id
 	* @param {string} sub: BoeingUS, BoeingUK, BoeingIN
	* @param {string} status: Active or Inactive
	*
 	*/
	transferSub(id, sub, status) {
		let tobeTransferred = {
			fcn: 'transfer',
			args: [ id, sub, status ]
		};
		this.setState({
			tobeTransferred
		});
		this.Modaltoggle('confirmationModal');
	}
	callTransferSub() {
		let { tobeTransferred } = this.state;
		this.props.dispatch(userActions.transferSubAction(tobeTransferred));
		this.Modaltoggle('confirmationModal');
	}

	certificationUpdate() {
		this.props.dispatch(
			modalActions.OpenModal({ type: modalConstants.CERT_SWITCH_MODAL, data: this.props.payload })
		);
	}

	render() {
		let { payload, list_updating } = this.props;
		let { selectedUser, tobeTransferred } = this.state;
		let isdata = payload !== undefined && payload !== null ? true : false;
		let view;
		var userlist_data;
		if (isdata) {
			view = payload.map((item) => {
				let statusClass = classNames('text-truncate', {
					'text-success': item.status === 'Active',
					'text-danger': item.status === 'Inactive'
				});
				return (
					<tr key={item.empid}>
						<td>{item.empid}</td>
						<td className="text-truncate">
							<a href="#" onClick={this.showUserDetail.bind(this, item.empid)}>
								{item.name}
							</a>
						</td>
						<td>
							<UncontrolledDropdown>
								<DropdownToggle
									caret
									tag="span"
									onClick={this.toggle}
									data-toggle="dropdown"
									aria-expanded={this.state.dropdownOpen}
								>
									{item.boeingsub}
								</DropdownToggle>
								<DropdownMenu>
									{item.boeingsub !== 'BoeingUS' && (
										<DropdownItem
											onClick={this.transferSub.bind(this, item.empid, 'BoeingUS', item.status)}
										>
											Boeing USA
										</DropdownItem>
									)}
									{item.boeingsub !== 'BoeingUK' && (
										<DropdownItem
											onClick={this.transferSub.bind(this, item.empid, 'BoeingUK', item.status)}
										>
											Boeing UK
										</DropdownItem>
									)}
									{item.boeingsub !== 'BoeingIN' && (
										<DropdownItem
											onClick={this.transferSub.bind(this, item.empid, 'BoeingIN', item.status)}
										>
											Boeing India
										</DropdownItem>
									)}
								</DropdownMenu>
							</UncontrolledDropdown>
						</td>
						<td className="text-truncate">{item.certdate}</td>
						<td className="text-truncate">{item.certification}</td>
						<td className="text-truncate">{item.designation}</td>
						<td className="text-truncate">{item.division}</td>
						<td className="text-truncate">{item.nationality}</td>
						<td className={statusClass}>{item.status}</td>
					</tr>
				);
			});
		}

		//employee detail table layout
		if (Object.keys(selectedUser).length > 0) {
			userlist_data = Object.keys(selectedUser).map((key) => {
				let activeClass = classNames({
					'text-success': selectedUser[key] === 'Active',
					'text-danger': selectedUser[key] === 'Inactive'
				});
				return (
					<Col sm="6" className="mb-3" key={key}>
						<div className="text-capitalize text-muted">{key}</div>
						<div style={{ fontSize: '16px' }} className={activeClass}>
							{selectedUser[key]}
						</div>
					</Col>
				);
			});
		}

		return (
			<div>
				<Reveal effect="fadeInSlow">
					<Container>
						<Row>
							<Col lg={{ size: 2 }} md={{ size: 2 }} sm={{ size: 4 }} xs={{ size: 6 }}>
								<Input placeholder="Search" disabled={!isdata} />
							</Col>
							<Col
								lg={{ size: 8, offset: 2 }}
								md={{ size: 2 }}
								sm={{ size: 4 }}
								xs={{ size: 6 }}
								className="text-right text-lg-right"
							>
								<Button type="button" onClick={this.addFormToggle.bind(this)}>
									{!this.state.showBar && (
										<span>
											<Icon icn="add" />
											<span className="ml-1">Add New Employee</span>
										</span>
									)}
									{this.state.showBar && <span>Cancel</span>}
								</Button>
								<Button
									type="button"
									disabled={!isdata}
									className="ml-lg-2"
									onClick={this.certificationUpdate}
								>
									Update Certifications
								</Button>
							</Col>
						</Row>
						<br />
						{this.state.showBar && (
							<div>
								<Adduserform /> <br />
							</div>
						)}
						{isdata && (
							<Table bordered striped responsive="sm" className="shadow-sm table-fixed-layout">
								<thead>
									<tr>
										<th>Id</th>
										<th>name</th>
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
						)}
						{!isdata &&
						!list_updating && (
							<Row>
								<Col sm={{ size: 6, offset: 3 }}>
									<Nodata />
								</Col>
							</Row>
						)}
					</Container>
				</Reveal>
				<Modal isOpen={this.state.modal} toggle={this.Modaltoggle.bind(this, 'modal')} backdrop={true}>
					<ModalHeader toggle={this.Modaltoggle.bind(this, 'modal')}>Employee Details</ModalHeader>
					<ModalBody>
						<Row>{userlist_data}</Row>
					</ModalBody>
				</Modal>

				<Modal
					isOpen={this.state.confirmationModal}
					toggle={this.Modaltoggle.bind(this, 'confirmationModal')}
					backdrop={'static'}
				>
					<ModalBody className="text-center" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
						{tobeTransferred && (
							<p className="h5 mb-5">
								Are you sure you want to transfer {tobeTransferred['args'][0]} to{' '}
								{tobeTransferred['args'][1]}?
							</p>
						)}
						<div>
							<Button type="button" color="success" onClick={this.callTransferSub}>
								Confirm
							</Button>
							<Button
								type="button"
								onClick={this.Modaltoggle.bind(this, 'confirmationModal')}
								color="default"
								className="ml-2"
							>
								Cancel
							</Button>
						</div>
					</ModalBody>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { list_updating, payload } = state.updateEmployeeListReducer;
	const { switching, transferred } = state.transferSubReducer;
	return {
		list_updating,
		payload,
		switching,
		transferred
	};
};

export default connect(mapStateToProps)(employee);
