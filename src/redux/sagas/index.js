import { all } from "redux-saga/effects";
import authSaga from "./AuthSaga";
import changeRequestsSaga from "./ChangeRequests.saga";

export default function* rootSaga() {
  yield all([authSaga(), changeRequestsSaga()]);
}
