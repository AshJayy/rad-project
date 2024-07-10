import Question from '../models/question.model.js'
import { errorHandler } from '../utils/error.js'

export const createQuestion = async (req, res, next) => {
   if (!req.user.userLevel == 1 && !req.user.userLevel == 2) {
      return next(errorHandler(403, 'You are not allowed to create a question'));
   }
   const { bank, content, options, correctAnswer, justification } = req.body;

   if (!bank || !content || !options || !correctAnswer) {
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