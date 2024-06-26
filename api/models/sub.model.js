import mongoose from "mongoose";

const subSchema = new mongoose.Schema({   
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    validUntil: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 0,
        // 0: inactive
        // 1: active
        // 2: pending
    },
    pendingPayment: {
        type: Date,
        default: null,
    },
    history: {
        type: Array,
        default: [],//has all the previous payment days
    }
},
{timestamps: true}//saving time of creation and update
);

const Sub = mongoose.model('Sub', subSchema);

export default Sub;