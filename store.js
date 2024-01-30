import { configureStore } from "@reduxjs/toolkit";
import scoreReducer from './src/scoreSlice'


export const store = configureStore({
    reducer: {
        scores: scoreReducer
    }
})