import express  from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { addExam, getExams, getUserExams }  from "../controllers/exam.controller.js";

const router = express.Router();

router.post('/addexam', addExam);
router.get('/getuserexams', verifyToken, getUserExams);
router.get('/getexams', getExams);

export default  router;