import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { createQuestion } from '../controllers/question.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createQuestion)

export default router;