import express  from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { addExam, getExams, getUserExams, updateExam }  from "../controllers/exam.controller.js";

const router = express.Router();

router.post('/addexam', addExam);
router.get('/getuserexams', verifyToken, getUserExams);
router.get('/getexams', getExams);
router.put('/update/:examID',verifyToken,updateExam);

export default  router;