import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    error: null,
    loading: false,
    examQuestions: null,  // Stores the exam questions or status
    remainingTime: null   // Stores the remaining time for the exam
}

const examSlice = createSlice({
    name: 'exam',
    initialState,
    reducers: {
        examStart: (state, action) => {
            state.loading = true;
            state.error = null;
            state.examQuestions = action.payload.examQuestions || 'inProgress'; // Initialize exam questions or status
            state.remainingTime = action.payload.remainingTime; // Initialize remaining time when exam starts
        },
        updateRemainingTime: (state, action) => {
            state.remainingTime = action.payload; // Update remaining time
        },
        examSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.examQuestions = 'completed';
            state.remainingTime = null; // Reset remaining time when the exam is completed
        },
        examFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.examQuestions = 'failed';
            state.remainingTime = null; // Reset remaining time on exam failure
        },
        signoutSuccess: (state) => {
            state.error = null;
            state.loading = false;
            state.examQuestions = null;
            state.remainingTime = null; // Reset remaining time on sign out
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.examQuestions = action.payload.examQuestions; // Update exam questions or status
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.examQuestions = null;
            state.remainingTime = null; // Reset exam data on user deletion
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
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
    updateStart, 
    updateSuccess, 
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    resetExamQuestions
} = examSlice.actions;

export default examSlice.reducer;
