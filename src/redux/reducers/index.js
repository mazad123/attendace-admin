import { combineReducers } from "redux";
import auth from "./AuthReducer";
import route from "./RouterReducer";
import changeRequests from "./ChangeRequestReducer";

const reducers = combineReducers({
  user: auth,
  changeRequests: changeRequests,
  route: route,
});

export default reducers;
