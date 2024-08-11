import express from 'express'
import { createExam } from '../controllers/exam.controller.js'

const router = express.Router();

router.post('/create', createExam)

export default router;