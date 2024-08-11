import Exam from '../models/exam.model.js';
import Question from '../models/question.model.js'
import { errorHandler } from '../utils/error.js'

// TODO: add user authentication
export const createQuestion = async (req, res, next) => {
   // if (!req.user.userLevel == 1 && !req.user.userLevel == 2) {
   //    return next(errorHandler(403, 'You are not allowed to create a question'));
   // }
   const { bank, content, options, correctAnswer, justification } = req.body;

   if (!bank || !content || !options || correctAnswer == null) {
      return next(errorHandler(400, 'Please provide all required fields'));
   }

   const newQuestion = new Question({
      bank,
      content,
      options,
      correctAnswer,
      justification
   });

   try {
      const savedQuestion = await newQuestion.save();
      res.status(201).json(savedQuestion);
   } catch (error) {
      next(error);
   }
};


export const getFreeTrial = async (req, res, next) => {
   try {
      const getFromBank = async (bank, limit) => {
         const questionSet = await Question.find({
            bank: bank,
            isActive: true
         })
         .sort({createdAt: 1})
         .limit(limit)
         return questionSet
      }

      var questions = []

      const questionSets = await Promise.all([
         getFromBank(1, 1),
         getFromBank(2, 1),
         getFromBank(3, 1),
         getFromBank(4, 1),
         getFromBank(5, 1),
         getFromBank(6, 1),
      ]);

      questionSets.forEach(set => {
         questions = questions.concat(set);
      });

      res.status(200).json(questions);

   } catch (error) {
      next(error)
   }
}

export const getQuestions = async (req, res, next) => {// get questions for exam
   try {
      const getFromBank = async (bank, limit) => {
         const questionSet = await Question.find({
            bank: bank,
            isActive: true
         })
         .sort({createdAt: 1})
         .limit(limit)
         return questionSet
      }

      var questions = []

      const questionSets = await Promise.all([// returns an array of questions when fullfilled
         getFromBank(1, 1),
         getFromBank(2, 1),
         getFromBank(3, 1),
         getFromBank(4, 1),
         getFromBank(5, 1),
         getFromBank(6, 1),
      ]);

      questionSets.forEach(set => {
         questions = questions.concat(set);
      });

      const pastExams = await Exam.find({userID: req.user._id}).sort({createdAt: -1}).limit(1);      
      const ExamNumber = !pastExams ? 0 : pastExams[0].examNo + 1;

      res.status(200).json({ questions, ExamNumber });

   } catch (error) {
      next(error)
   }
}

export const editQuestion = async (req, res, next) => {
   // if (req.user.userLevel !== 1 && req.user.userLevel !== 2) { // Allow only admins and super admins to edit questions
   //    return next(errorHandler(403, 'You are not allowed to edit a question'));
   // }

   const { bank, content, options, correctAnswer, justification } = req.body;
   const questionId = req.body._id;

   // Making sure all fields are filled
   if (!bank || !content || !Array.isArray(options) || options.length === 0 || correctAnswer === null || !questionId) {
      return next(errorHandler(400, 'Please provide all required fields'));
   }

   try {
      const updatedQuestion = await Question.findByIdAndUpdate(questionId, {
         $set: {
            bank,
            content,
            options,
            correctAnswer,
            justification
         }
      }, { new: true });

      if (!updatedQuestion) {
         return next(errorHandler(404, 'Question not found'));
      }

      res.status(200).json(updatedQuestion);
   } catch (error) {
      next(error);
   }
}

export const deleteQuestion = async (req, res, next) => {
   // if (req.user.userLevel !== 1 && req.user.userLevel !== 2) { // Allow only admins and super admins to delete questions
   //    return next(errorHandler(403, 'You are not allowed to delete a question'));
   // }

   const questionId = req.params.questionId;

   try {
      const deletedQuestion = await Question.findByIdAndDelete(questionId);

      if (!deletedQuestion) {
         return next(errorHandler(404, 'Question not found'));
      }

      res.status(200).json('Question deleted successfully');
   } catch (error) {
      next(error);
   }
}