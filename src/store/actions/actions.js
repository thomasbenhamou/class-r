import * as actionTypes from './actionTypes';

export const selectClient = (clientId) => {
  return {
    type: actionTypes.SELECT_CLIENT,
    clientId: clientId
  }
}

export const initAuth = (authUser) => {
  return {
    type: actionTypes.INIT_AUTH,
    authUser: authUser
  }
}