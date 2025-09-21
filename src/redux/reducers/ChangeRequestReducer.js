import {
  GET_REQUEST,
  GET_REQUEST_SUCCESS,
  GET_REQUEST_FAIL,
} from "../constants/ActionTypes";

const INIT_STATE = {
  requests: [],
  loading: false,
  error: null,
};

export default function auth(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        requests: action.requests,
      };
    case GET_REQUEST_FAIL:
      return {
        ...state,
        requests: action.payload.requests,
      };
    default:
      return state;
  }
}
