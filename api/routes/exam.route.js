import express  from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { addExam, getUserExams }  from "../controllers/exam.controller.js";

const router = express.Router();

router.post('/addexam', addExam);
router.get('/getuserexams', verifyToken, getUserExams);

export default  router;