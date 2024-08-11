import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { createQuestion, getFreeTrial, getQuestions, editQuestion, deleteQuestion, } from '../controllers/question.controller.js';

const router = express.Router();
// TODO: add verify token
router.post('/create', createQuestion);
router.get('/freetrial', getFreeTrial);
router.get('/getquestions', getQuestions);
router.put('/editquestion', editQuestion);
router.delete('/deletequestion/:questionId', deleteQuestion);

export default router;