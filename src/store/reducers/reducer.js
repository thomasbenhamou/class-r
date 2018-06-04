import * as actionTypes from '../actions/actionTypes';

const initialState = {
  selectedClient: null,
  authUser: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELECT_CLIENT:
      return {
        ...state,
        selectedClient: action.clientId
      }
    case actionTypes.INIT_AUTH:
        return {
          ...state,
          authUser: action.authUser
        }
    default:
      return state;
  }
}

export default reducer;