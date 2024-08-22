import Exam from '../models/exam.model.js';
import Question from '../models/question.model.js'
import { errorHandler } from '../utils/error.js'

// TODO: add user authentication
export const createQuestion = async (req, res, next) => {
   if (req.user.userLevel !== 1 && req.user.userLevel !== 2) {
      return next(errorHandler(403, 'You are not allowed to create a question'));
   }
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

export const getQuestions = async (req, res, next) => {
   try {
      //get the recent exam details
      const pastExams = await Exam.find({ userID: req.user._id }).select('questions').lean();

      //get the already answered Question ids
      const usedQuestionIds = pastExams.reduce((acc, exam) => {
         return acc.concat(exam.questions.map(q => q.toString()));
      }, []);

      const getFromBank = async (bank, limit) => {
         const questionSet = await Question.aggregate([
            { $match: { bank: bank, isActive: true, _id: { $nin: usedQuestionIds } } }, // Exclude used questions
            { $sample: { size: limit } } // Randomly select the specified number of questions
         ]);
         return questionSet;
      }

      // Fetch questions from multiple banks
      const questionSets = await Promise.all([
         getFromBank(1, 8),
         getFromBank(2, 6),
         getFromBank(3, 4),
         getFromBank(4, 4),
         getFromBank(5, 4),
         getFromBank(6, 4),
      ]);
      //limits of the questions picked are in the rtio of 1:5 from the supplied requ to original requirments given

      //bank    | given | original |
      //  1     |   8   |    40    |
      //  2     |   6   |    30    |
      //  3     |   4   |    20    |
      //  4     |   4   |    20    |
      //  5     |   4   |    20    |
      //  6     |   4   |    20    |
      // Total  |  30   |   150    |

      // Combine all question sets into a single array
      const questions = questionSets.flat();
      
      // Calculate the new ExamNumber
      const ExamNumber = pastExams.length === 0 ? 1 : pastExams[0].examNo + 1;

      // Send the response with the questions and the exam number
      res.status(200).json({ questions, ExamNumber });

   } catch (error) {
      console.error('Error fetching questions:', error);
      next(error);
   }
}


export const editQuestion = async (req, res, next) => {
   if (req.user.userLevel !== 1 && req.user.userLevel !== 2) { // Allow only admins and super admins to edit questions
      return next(errorHandler(403, 'You are not allowed to edit a question'));
   }

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
   if (req.user.userLevel !== 1 && req.user.userLevel !== 2) { // Allow only admins and super admins to delete questions
      return next(errorHandler(403, 'You are not allowed to delete a question'));
   }

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