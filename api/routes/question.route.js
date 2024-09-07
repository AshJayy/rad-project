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
  getQuestionById,
  activeQuestion
} from "../controllers/question.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createQuestion);
router.get("/freetrial", verifyToken, getFreeTrial);
router.get("/getuserquestions", verifyToken, getUserQuestions);
router.get("/getnextexam", verifyToken, getNextExam);
router.get("/getquestions", verifyToken, getQuestions);
router.put("/editquestion/:questionId", verifyToken, editQuestion);
router.delete("/deletequestion/:questionId", verifyToken, deleteQuestion);
router.get("/getquestion/:questionId", verifyToken, getQuestionById);
router.put("/activequestion/:questionId", verifyToken, activeQuestion);



export default router;
