import mongoose from "mongoose";
import Exam from "../models/exam.model.js";
import Question from "../models/question.model.js";
import { errorHandler } from "../utils/error.js";

export const addExam = async (req, res, next) => {
  const { userID, questions, totalMarks, timeTaken, done } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userID)) {
    return next(errorHandler(400, "Invalid user ID"));
  }

  try {
    // Fetch the latest exam for the user and get the highest exam number
    const lastExam = await Exam.findOne({ userID }).sort({ examNo: -1 }).exec();
    const nextExamNo = lastExam ? lastExam.examNo + 1 : 1;

    const questionIDs = questions.map((question) => question.questionID);
    const validQuestions = await Question.find({ _id: { $in: questionIDs } });

    if (validQuestions.length !== questionIDs.length) {
      return next(errorHandler(400, "Invalid question IDs"));
    }

    const exam = new Exam({
      userID,
      examNo: nextExamNo, // Use the next sequential exam number
      questions,
      totalMarks,
      takenTime: timeTaken, // Using takenTime instead of timeTaken based on your schema
      done
    });

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

export const getExams = async (req, res, next) => {
  try {
    const { limit, skip } = req.query;

    // Helper function to get the start and end date of a month
    const getMonthRange = (year, month) => {
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999); // Set to the end of the last day of the month
      return { startOfMonth, endOfMonth };
    };

    // Get the current date
    const currentDate = new Date();

    // Array to store data for the last seven months
    const lastSevenMonthsData = [];

    // Loop through the last seven months
    for (let i = 0; i < 7; i++) {
      const month = currentDate.getMonth() - i;
      const year = currentDate.getFullYear();

      // Adjust year and month for cases where the month is negative (i.e., before January)
      const adjustedYear = month < 0 ? year - 1 : year;
      const adjustedMonth = (month + 12) % 12;

      const { startOfMonth, endOfMonth } = getMonthRange(adjustedYear, adjustedMonth);

      // Get the count of exams created in this month
      const examsInMonth = await Exam.find({
        createdAt: { $gte: startOfMonth, $lt: endOfMonth }
      }).exec();

      const totalExamsInMonth = examsInMonth.length;

      lastSevenMonthsData.push({
        month: startOfMonth.toLocaleString('default', { month: 'long' }),
        examsCount: totalExamsInMonth,
      });
    }

    // Fetch exams with pagination if limit and skip are provided
    const exams = await Exam.find({})
      .limit(limit ? parseInt(limit) : 0)
      .skip(skip ? parseInt(skip) : 0)
      .exec();

    // Get the total number of exams in the database
    const totalExams = await Exam.countDocuments();

    res.status(200).json({
      success: true,
      exams,
      totalExams,
      lastSevenMonthsData, // Add the exams count for the last seven months
    });
  } catch (error) {
    // Handle any errors and pass them to the next middleware (error handler)
    next(error);
  }
};
