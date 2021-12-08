import { createSlice } from '@reduxjs/toolkit';

export const gameSlice = createSlice({
  name: 'game',
  initialState: {
    characters: false,
    number: 0,
    playerCharacters: {

    },
    gameQuestions: []
  },
  reducers: {
    setPlayerCharacter: (state, action) => {
        state.playerCharacters[action.payload["player"]] = [action.payload["character"]["name"], action.payload["character"]["description"]]
    }, 
    setCharacters: (state, action) => {
        state.characters = !state.characters;
    },
    addGameQuestion: (state, action) => {
        state.gameQuestions.splice(action.payload["number"], 0, action.payload["data"])
    }, 
    clearGame: (state, action) => {
      state.gameQuestions = []
    }, 
    nextElement: (state, action) => {
      const questions = state.gameQuestions
      questions.shift()
      state.gameQuestions = questions
    }
  },
});

export const {setPlayerCharacter, setCharacters, addGameQuestion, clearGame, nextElement } = gameSlice.actions;


export default gameSlice.reducer;
