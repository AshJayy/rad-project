import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: 'idle',  // Can be 'idle', 'loading', 'succeeded', 'failed'
    examQuestions: null,  // Stores the exam questions or status
    remainingTime: null   // Stores the remaining time for the exam
}

const examSlice = createSlice({
    name: 'exam',
    initialState,
    reducers: {
        examStart: (state, action) => {
            state.status = 'loading';
            state.examQuestions = action.payload.examQuestions || 'inProgress'; // Initialize exam questions or status
            state.remainingTime = action.payload.remainingTime; // Initialize remaining time when exam starts
        },
        updateRemainingTime: (state, action) => {
            state.remainingTime = action.payload; // Update remaining time
        },
        examSuccess: (state) => {
            state.status = 'succeeded';
            state.examQuestions = 'completed';
            state.remainingTime = null; // Reset remaining time when the exam is completed
        },
        examFailure: (state, action) => {
            state.status = 'failed';
            state.examQuestions = 'failed';
            state.remainingTime = null; // Reset remaining time on exam failure
        },
        signoutSuccess: (state) => {
            state.status = 'idle';
            state.examQuestions = null;
            state.remainingTime = null; // Reset remaining time on sign out
        },
        resetExamQuestions: (state) => {
            state.examQuestions = null;
            state.remainingTime = null; // Reset remaining time when exam status is reset
        }
    }
});

export const {
    examStart,
    updateRemainingTime,
    examSuccess,
    examFailure,
    signoutSuccess,
    resetExamQuestions
} = examSlice.actions;

export default examSlice.reducer;
