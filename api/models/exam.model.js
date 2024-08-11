import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    attendeeName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    questions: [
      {
        questionId: {
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
    }
  },
  { timestamps: true }
);

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
