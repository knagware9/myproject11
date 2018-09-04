import { modalConstants } from "../actions/_constants/modal.constants";

export function modalReducers(state = {}, action = {}) {
  switch (action.type) {
    case modalConstants.OPEN_MODAL:
      return {
        payload: action.payload
      };
    case modalConstants.CLOSE_MODAL:
      return {};
    default:
      return state;
  }
}
