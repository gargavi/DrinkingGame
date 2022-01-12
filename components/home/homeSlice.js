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
        "nsfw": true,
    }, 
    length: 10, 
    start: false, 
    name: "", 
    room: "",
    admin: false,
    refresh: true, 
    roomData: {}, 
    socket: null, 
    
  },
  reducers: {
    setPlayers: (state, action) => {
      state.players = (action.payload); 
    },
    setStart: (state, action) => {
      state.start = action.payload
    },
    setRoomData: (state, action) => {
      state.roomData = action.payload
    },
    setAdmin: (state, action) => {
      state.admin = action.payload;
    }, 
    setSocket: (state, action) => {
      state.socket = action.payload
    }, 
    setGames: (state,action) => {

        state.games[action.payload] = !state.games[action.payload]
    },
    removePlayer: (state, action) => {
      state.players = state.players.filter((player) => player != action.payload)
    },
    setRefresh: (state, action) => {
      state.refresh = !state.refresh;
    }, 
    setName: (state, action) => {
      state.name = action.payload; 
    },
    setRoom: (state, action) => {
      state.room = action.payload; 
    },
  },
});

export const {setPlayers, setAdmin, setStart, setGames, removePlayer, setRefresh, setName, setRoom, setRoomData, setSocket} = homeSlice.actions;


export default homeSlice.reducer;
