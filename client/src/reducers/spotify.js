import {
    PLAY,
    SONG_SKIPPED,
    SONG_OVER,
    PAUSE,
    TIMER_RUNNING
  } from "../actions/types";
  
  const initialState = {
    is_playing: false,
    progress_ms: null,
    song_name: null,
    artist_name:null,
    duration_ms: null,
    timer:null
  };
  
  export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case SONG_SKIPPED:
        case SONG_OVER:
        return {
          ...state,
          song_name: payload.item.name,
          progress_ms: 0,
          artist_name: payload.item.artists[0].name,
          duration_ms: payload.item.duration_ms
        };
      case PLAY:
        return {
            ...state,
            is_playing:true,
            song_name: payload.item.name,
            progress_ms: payload.progress_ms,
            artist_name: payload.item.artists[0].name,
            duration_ms: payload.item.duration_ms
        };
      case PAUSE:
        return {
            ...state,
            is_playing:false
        }
      case TIMER_RUNNING:
          return {
              ...state,
              id:payload
          }
      default:
        return state;
    }
  }
  