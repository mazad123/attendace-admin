import {
  GET_REQUEST,
  GET_REQUEST_SUCCESS,
  GET_REQUEST_FAIL,
} from "../constants/ActionTypes";

export const getRequests = (requests) => {
  return {
    type: GET_REQUEST,
    payload: requests,
  };
};

export const getRequestsSuccess = (requests) => {
  return {
    type: GET_REQUEST_SUCCESS,
    payload: requests,
  };
};

export const getRequestsFail = (requests) => {
  return {
    type: GET_REQUEST_FAIL,
    payload: requests,
  };
};
