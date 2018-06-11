import * as actionTypes from '../actions/actionTypes';

const initialState = {
  selectedClient: null,
  authUser: null,
  customLogo: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELECT_CLIENT:
      return {
        ...state,
        selectedClient: action.clientId
      };
    case actionTypes.INIT_AUTH:
      return {
        ...state,
        authUser: action.authUser
      };
    case actionTypes.USE_CUSTOM_LOGO:
      return {
        ...state,
        customLogo: true
      };
    default:
      return state;
  }
};

export default reducer;
