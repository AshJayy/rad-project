import express  from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { addExam }  from "../controllers/exam.controller.js";

const router = express.Router();

router.post('/addexam', addExam);

export default  router;