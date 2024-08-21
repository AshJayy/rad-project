import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { createQuestion, getFreeTrial, getQuestions, editQuestion, deleteQuestion, } from '../controllers/question.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createQuestion);
router.get('/freetrial',verifyToken, getFreeTrial);
router.get('/getquestions',verifyToken ,getQuestions);
router.put('/editquestion', verifyToken,editQuestion);
router.delete('/deletequestion/:questionId',verifyToken, deleteQuestion);

export default router;