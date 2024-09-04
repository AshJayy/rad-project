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

export const getUserQuestions = async (req, res, next) => {
   try {
      // Get the recent exam details
      const pastExams = await Exam.find({ userID: req.user.id }).select('questions').lean();
      
 

      // Get the already answered Question IDs
      const usedQuestionIds = pastExams.reduce((acc, exam) => {
         return acc.concat(exam.questions.map(q => q._id.toString())); // Extract the _id field
      }, []);
      
      // Function to get questions from a specific bank, excluding used questions
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

      // TEST
      // const questionSets = await Promise.all([
      //    getFromBank(1, 1),
      //    getFromBank(2, 1),
      //    getFromBank(3, 1),
      //    getFromBank(4, 1),
      //    getFromBank(5, 1),
      //    getFromBank(6, 1),
      // ]);
      
      // Combine all question sets into a single array
      const questions = questionSets.flat();
      
      // Calculate the new ExamNumber
      // const ExamNumber = pastExams.length === 0 ? 1 : pastExams[0].examNo + 1;
   
      // Send the response with the questions and the exam number
      res.status(200).json(questions);

   } catch (error) {
      console.error('Error fetching questions:', error);
      next(error); // Pass the error to the next middleware
   }
}

export const getNextExam = async (req, res, next) => {
   try {
     // Get the recent exam details for the user
     const pastExams = await Exam.find({ userID: req.user._id }).select('questions').lean();
 
     // Extract IDs of already answered questions
     const usedQuestionIds = pastExams.reduce((acc, exam) => {
      return acc.concat(exam.questions.map(q => q._id.toString())); // Extract the _id field
   }, []);
 
     // Define the criteria for the exam (e.g., total number of questions required from each bank)
     const requiredQuestions = {
       1: 8,  // Bank 1 requires 8 questions
       2: 6,  // Bank 2 requires 6 questions
       3: 4,  // Bank 3 requires 4 questions
       4: 4,  // Bank 4 requires 4 questions
       5: 4,  // Bank 5 requires 4 questions
       6: 4   // Bank 6 requires 4 questions
     };
 
     // Function to check if enough questions are available in a given bank, excluding used questions
     const checkBankAvailability = async (bank, limit) => {
       const availableQuestions = await Question.countDocuments({
         bank: bank,
         isActive: true,
         _id: { $nin: usedQuestionIds }  // Exclude already used questions
       });
       return availableQuestions >= limit;
     };
 
     // Check availability for each bank in parallel
     const bankAvailability = await Promise.all(
       Object.entries(requiredQuestions).map(([bank, limit]) =>
         checkBankAvailability(parseInt(bank), limit)
       )
     );
 
     // Determine if all banks have enough questions
     const enoughQuestionsAvailable = bankAvailability.every((available) => available);
 
     if (enoughQuestionsAvailable) {
       res.status(200).json({ message: "Enough questions are available to create the next exam." });
     } else {
       res.status(400).json({ message: "Not enough questions available to create the next exam." });
     }
   } catch (error) {
     console.error('Error checking question availability:', error);
     next(error);
   }
 };
 


export const editQuestion = async (req, res, next) => {
   if (req.user.userLevel !== 1 && req.user.userLevel !== 2) { // Allow only admins and super admins to edit questions
      return next(errorHandler(403, 'You are not allowed to edit a question'));
   }

   const { bank, content, options, correctAnswer, justification } = req.body;
   const questionId = req.params.questionId;


   // Making sure all fields are filled
   if (!bank || !content || !Array.isArray(options) || options.length === 0 || correctAnswer === null) {
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

export const getQuestions = async (req, res, next) => {
   try {
       const startIndex = parseInt(req.query.startIndex) || 0;
       const limit = parseInt(req.query.limit) || 6;
       const sortDirrection = req.query.sort === 'asc' ? 1 : -1;
       console.log(req.query);
       
       const questions = await Question.find({
           ...(req.query.Id && { _id: req.query.Id }),
           ...(req.query.bank && { category: req.query.bank }),
           ...(req.query.content && { content: req.query.content }),
           ...(req.query.searchTerm && {
               $or: [
                  //  { _id: { $regex: req.query.Id, $options: 'i' } },
                   { options: { $elemMatch: { $regex: new RegExp(req.query.searchTerm, 'i') } } },
                   { content: { $regex: new RegExp(req.query.searchTerm, 'i') } },
                   { justification: { $regex: new RegExp(req.query.searchTerm, 'i') } },
               ],
           }),
       })
           .sort({ updatedAt: sortDirrection })
           .skip(startIndex)
           .limit(limit);
       
       const totalQuestions = await Question.countDocuments();
       res
           .status(200)
           .json({ 
               questions, 
               totalQuestions, 
           });
       
   } catch (error) {
       next(error);
   }
}


export const getQuestionById = async (req, res, next) => {
   const questionId = req.params.questionId;
   
   

   try {
      const question = await Question.findById(questionId)
      if (!question) {
         return next(errorHandler(404, 'Question not found'));
      }

      res.status(200).json(question);
      console.log(question);
      

   } catch (error) {
      next(error)
   }
}