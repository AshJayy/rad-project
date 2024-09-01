import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    examNo: {
      type: Number,
      required: true
    },
    questions: [
      {
        questionID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true
        },
        choice: {
          type: Number,
          required: true
        }
      }
    ],
    totalMarks: {
      type: Number,
      required: true,
      default: 0
    },
    takenTime: {
      type: Number,
      default: 0
    },
    done: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
