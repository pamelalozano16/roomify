import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import spotify from "./spotify";

export default combineReducers({
  alert,
  auth,
  spotify
});
