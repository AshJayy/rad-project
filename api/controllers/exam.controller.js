import Exam from '../models/exam.model.js'

export const createExam = async (req,res) => {
    const { questions, marks } = req.body;
    console.log(questions + marks)
    res.send()

}
