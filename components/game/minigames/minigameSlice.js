import { createSlice } from '@reduxjs/toolkit';

export const minigameSlice = createSlice({
  name: 'minigame',
  initialState: {
    likely: [], 
    rather: [], 
    trivia: [], 
    categories: [],
    never: []
    
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
    setCategories: (state, action) => {
      state.categories = action.payload
    },
    setNever: (state, action) => {
      state.never = action.payload
    },
  },
});

export const {setLikely, setRather, setTrivia, setCategories, setNever} = minigameSlice.actions;


export default minigameSlice.reducer;
