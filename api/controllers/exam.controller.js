import mongoose from "mongoose";
import Exam from "../models/exam.model.js";
import Question from "../models/question.model.js";
import { errorHandler } from "../utils/error.js";

export const addExam = async (req, res, next) => {
  const { userID, examNo, questions, totalMarks, timeTaken } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userID)) {
    console.log(userID)
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
    timeTaken,
  });

  try {
    await exam.save();
    res.status(201).json("Exam added successfully");
  } catch (error) {
    next(error);
  }
};

export const getUserExams = async (req, res, next) => {
  const { userID, examID } = req.query;
  if (userID && !mongoose.Types.ObjectId.isValid(userID)) {// check if only userID available
    return next(errorHandler(400, "Invalid user ID"));
  }

  try {
    // Construct the query object conditionally
    const exams = await Exam.find({ 
      ...(userID && {userID: userID}), // get all exams of a user
      ...(examID && {_id: examID}) //get a single exam
    }).sort({ examNo: 1 });

    res.status(200).json(exams);
  } catch (error) {
    next(error);
  }
}