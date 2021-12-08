import { configureStore } from '@reduxjs/toolkit'; 
import homeReducer from "../home/homeSlice";
import gameReducer from "../game/gameSlice";
import timerReducer from "../timer/timerSlice";

export default configureStore({
  reducer: {
      home: homeReducer,
      game: gameReducer, 
      timer: timerReducer
  },
});
