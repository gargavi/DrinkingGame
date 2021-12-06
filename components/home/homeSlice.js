import { createSlice } from '@reduxjs/toolkit';

export const homeSlice = createSlice({
  name: 'home',
  initialState: {
    players: [],
    games: {
        "most_likely": false,
        "number_game": false,
        "trivia": false,
        "quickdraw": false,
        "drive": false,
        "cheese_touch": false,
        "random_characters": false,
    }
  },
  reducers: {
    setPlayers: (state, action) => {
      state.players.push(action.payload); 
    },
    setGames: (state,action) => {
        
        state.games[action.payload] = !state.games[action.payload]
    },
    removePlayer: (state, action) => {
      state.players = state.players.filter((player) => player != action.payload)
    }
  },
});

export const {setPlayers, setGames, removePlayer} = homeSlice.actions;


export default homeSlice.reducer;
