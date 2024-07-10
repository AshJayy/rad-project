import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { createQuestion, getFreeTrial } from '../controllers/question.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createQuestion);
router.get('/freetrial', getFreeTrial)

export default router;