import mongoose from "mongoose";
import Exam from "../models/exam.model.js";
import Question from "../models/question.model.js";
import { errorHandler } from "../utils/error.js";

export const addExam = async (req, res, next) => {
  const { userID, examNo, questions, totalMarks } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userID)) {
    return next(errorHandler(400, "Invalid user ID"));
  }

  const questionIDs = questions.map((question) => question.questionID);
  const validQuestions = await Question.find({ _id: { $in: questionIDs } });
  if (validQuestions.length !== questionIDs.length) {
    return next(errorHandler(400, "Invalid question IDs"));
  }

  const exam = new Exam({
    userID,
    examNo,
    questions,
    totalMarks,
  });

  try {
    await exam.save();
    res.status(201).json("Exam added successfully");
  } catch (error) {
    next(error);
  }
};
