import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { createQuestion, getFreeTrial, getQuestions, editQuestion } from '../controllers/question.controller.js';
import { get } from 'mongoose';

const router = express.Router();

router.post('/create', verifyToken, createQuestion);
router.get('/freetrial', getFreeTrial);
router.get('/getquestions', getQuestions);
router.put('/editquestion', editQuestion); //verifyToken should be added later

export default router;