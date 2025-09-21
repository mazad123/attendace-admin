import { call, put, takeEvery, fork, all } from "redux-saga/effects";
import { toast } from "react-toastify";
import { httpClient } from "../../constants/Api";
import { REQUEST } from "../../constants/AppConstants";
import {
  GET_REQUEST,
  GET_REQUEST_SUCCESS,
  GET_REQUEST_FAIL,
} from "../constants/ActionTypes";

const changeRequests = async (page) => {
  return await httpClient.get(`${REQUEST.GET_UNSEEN_REQUESTS}`);
};

function* getRequests(data) {
  try {
    const response = yield call(changeRequests);
    yield put({
      type: GET_REQUEST_SUCCESS,
      requests: response.data.requests,
    });
  } catch (err) {
    if (err.response) {
      yield put({ type: GET_REQUEST_FAIL, message: err.response.data.message });
      toast.error(err.response.data.message);
    } else {
      toast.error("Something went wrong");
    }
  }
}

function* getChangeRequests() {
  yield takeEvery(GET_REQUEST, getRequests);
}

export default function* rootSaga() {
  yield all([fork(getChangeRequests)]);
}
