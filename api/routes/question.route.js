import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { createQuestion, getFreeTrial, getQuestions } from '../controllers/question.controller.js';
import { get } from 'mongoose';

const router = express.Router();

router.post('/create', verifyToken, createQuestion);
router.get('/freetrial', getFreeTrial);
router.get('/getquestions', getQuestions);

export default router;