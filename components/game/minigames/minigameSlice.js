import { createSlice } from '@reduxjs/toolkit';

export const minigameSlice = createSlice({
  name: 'minigame',
  initialState: {
    likely: [], 
    rather: [], 
    trivia: [], 
    
  },
  reducers: {
    setLikely: (state, action) => {
      state.likely = action.payload; 
    },
    setRather: (state, action) => {
      state.rather = action.payload
    },
    setTrivia: (state, action) => {
      state.trivia = action.payload
    },
  },
});

export const {setLikely, setRather, setTrivia} = minigameSlice.actions;


export default minigameSlice.reducer;
