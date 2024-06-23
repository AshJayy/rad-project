import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
   bank: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5, 6]
    },
    content: {
      type: String,
      required: true
    },
    options: {
      type: [String],
      required: true
    },
    correctAnswer: {
      type: Number,
      required: true
    },
    justification: {
      type: String,
      default: ''
    },
   },
  { timestamps: true }
);

const Question = mongoose.model('Question', questionSchema);

export default Question;