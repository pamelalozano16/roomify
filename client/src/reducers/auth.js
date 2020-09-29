import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SPOTIFY_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
  access_token: localStorage.getItem("token_spotify"),
  token_type: null,
  expires_in: null,
  refresh_token: null,
  scope: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case LOGOUT:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case AUTH_ERROR:
      localStorage.removeItem("token");
      localStorage.removeItem("token_spotify");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        token_type: null,
        expires_in: null,
        refresh_token: null,
        scope: null,
      };
    case LOGIN_SPOTIFY_SUCCESS:
      localStorage.setItem("token_spotify", payload.access_token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    default:
      return state;
  }
}
