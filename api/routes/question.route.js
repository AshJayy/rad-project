import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createQuestion,
  getFreeTrial,
  getUserQuestions,
  getQuestions,
  editQuestion,
  deleteQuestion,
  getNextExam,
  getQuestionById
} from "../controllers/question.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createQuestion);
router.get("/freetrial", verifyToken, getFreeTrial);
router.get("/getuserquestions", verifyToken, getUserQuestions);
router.get("/getnextexam", verifyToken, getNextExam);
router.get("/getquestions", verifyToken, getQuestions);
router.put("/editQuestion/:questionId", verifyToken, editQuestion);
router.delete("/deletequestion/:questionId", verifyToken, deleteQuestion);
router.post('/create', verifyToken, createQuestion);
router.get('/freetrial',verifyToken, getFreeTrial);
router.get('/getquestions',verifyToken ,getQuestions);
router.put('/editquestion', verifyToken,editQuestion);
router.delete('/deletequestion/:questionId',verifyToken, deleteQuestion);
router.get('/getquestion/:questionId',verifyToken, getQuestionById);

export default router;
