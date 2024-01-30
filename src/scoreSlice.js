import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    player1: 0,
    player2: 0
}


export const scoreSlice = createSlice({
    name: 'score',
    initialState,
    reducers: {
        incrementPlayer1: (state) => {
            state.player1++
        },
        incrementPlayer2: (state) => {
            state.player2++
        },
        resetScores: (state) => {
            state.player1 = 0
            state.player2 = 0
        }
    }
})

export const { incrementPlayer1, incrementPlayer2, resetScores } = scoreSlice.actions

export default scoreSlice.reducer