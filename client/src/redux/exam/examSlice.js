import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isReady: false,  // Indicates if the exam is ready to start
    status: 'idle',  // Can be 'idle', 'loading', 'inProgress', 'succeeded', 'failed'
    examQuestions: [],  // Stores the exam questions or status
    remainingTime: 0,  // Stores the remaining time for the exam
    questionNo: 0 // Stores the current question number
}

const examSlice = createSlice({
    name: 'exam',
    initialState,
    reducers: {
        examStart: (state, action) => {
            state.isReady = true; 
            state.status = 'inProgress'; // Set status to inProgress when exam starts
            state.examQuestions = action.payload.examQuestions || []; // Initialize exam questions or status
            state.remainingTime = action.payload.remainingTime || 0; // Initialize remaining time when exam starts
        },
        updateRemainingTime: (state, action) => {
            state.remainingTime = action.payload || 0; // Update remaining time
        },
        examSuccess: (state) => {
            state.isReady = false;
            state.status = 'succeeded';
            state.examQuestions = []; // Consistent reset for exam questions
            state.remainingTime = 0; // Reset remaining time when the exam is completed
        },
        examFailure: (state, action) => {
            state.status = 'failed';
            state.examQuestions = []; // Consistent reset for exam questions
            state.remainingTime = 0; // Reset remaining time on exam failure
        },
        signoutSuccess: (state) => {
            state.status = 'idle';
            state.examQuestions = []; // Reset exam questions on sign out
            state.remainingTime = 0; // Reset remaining time on sign out
        },
        updateExamQuestions: (state, action) => {
            state.examQuestions = action.payload.examQuestions || state.examQuestions;
            state.questionNo = action.payload.questionNo || state.questionNo;
        }
    }
});

export const {
    examStart,
    updateRemainingTime,
    examSuccess,
    examFailure,
    signoutSuccess,
    updateExamQuestions
} = examSlice.actions;

export default examSlice.reducer;