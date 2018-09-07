import { modalConstants } from "../actions/_constants/modal.constants";

export const modalActions = {
  OpenModal,
  CloseModal
};

function OpenModal(payload) {
  return {
    type: modalConstants.OPEN_MODAL,
    payload
  };
}
function CloseModal() {
  return { type: modalConstants.CLOSE_MODAL };
}

