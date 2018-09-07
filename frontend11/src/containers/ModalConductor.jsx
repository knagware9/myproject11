import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { modalConstants } from '../actions/_constants/modal.constants';
import CertificateSwitch from '../views/modals/Cert_switch.modal';

const ModalConductor = (props) => {
	const modaltype = props.modalReducers.payload ? props.modalReducers.payload.type : '';
	const modalData = props.modalReducers.payload ? props.modalReducers.payload.data : [];
	const dispatch = props.dispatch;
	const isOpen = modaltype ? true : false;
	switch (modaltype) {
		case modalConstants.CERT_SWITCH_MODAL:
			return <CertificateSwitch isopen={isOpen} payload={modalData} dispatch={dispatch} switching={props.switching}/>;
		default:
			return null;
	}
};

ModalConductor.propTypes = {
	type: PropTypes.string,
	data: PropTypes.array,
	dispatch: PropTypes.func
};

const mapStateToProps = (state) => {
  const {switching} = state.transferSubReducer;
  const {modalReducers} = state;
	return {
    modalReducers,
    switching
  }
};

export default connect(mapStateToProps)(ModalConductor);
