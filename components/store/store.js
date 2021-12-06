import { configureStore } from '@reduxjs/toolkit'; 
import homeReducer from "../home/homeSlice";
export default configureStore({
  reducer: {
      home: homeReducer
  },
});
