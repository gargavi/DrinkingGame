import { configureStore } from '@reduxjs/toolkit'; 
import homeReducer from "../home/homeSlice";
import gameReducer from "../gamePrev/gameSlice";
import timerReducer from "../timer/timerSlice";
import minigameReducer from "../game/minigames/minigameSlice"

export default configureStore({
  reducer: {
      home: homeReducer,
      game: gameReducer, 
      timer: timerReducer,
      minigame: minigameReducer
  },
});
