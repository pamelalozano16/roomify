import axios from "axios";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";
import {
    PLAY,
    SONG_SKIPPED,
    SONG_OVER,
    PAUSE,
    TIMER_RUNNING
} from "./types";

export const loadCurrentSong = () => async (dispatch) => {
 /*   try {
        const res = await axios.get('/api/spotify/playing');
        console.log(res);
    } catch (error) {
        console.log(error);
    }*/
    console.log('hola')
    return false;
}
export const setTimerId = (id) => async (dispatch) => {
    dispatch({
        type: TIMER_RUNNING,
        payload: id,
      });

}

//Login user
/*export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post("/api/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};
*/
