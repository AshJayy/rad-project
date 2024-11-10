import mongoose from "mongoose";

const subSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    sessionId: {
      type: String,
      default: null,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    status: {
      type: Number,
      required: true,
      default: 0,
      enum: [0, 1, 2], // Ensures that status can only be 0, 1, or 2
      // 0: inactive
      // 1: active
      // 2: pending
    },
    history: {
      type: [
        {
          paymentDate: {
            type: Date,
            required: true,
          },
          type: {
            type: String,
            required: true,
            enum: [1, 2, 3],
          },
        },
      ],
      default: [], 
    },

  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

const Sub = mongoose.model("Sub", subSchema);

export default Sub;
