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