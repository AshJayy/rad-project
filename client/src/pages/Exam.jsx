import { Alert, Button, Label, List, Radio, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AiFillClockCircle } from "react-icons/ai";
import { HiChevronRight, HiOutlinePencilAlt, HiOutlinePencil } from "react-icons/hi";
import Question from "../components/Question";
import Answers from "./Answers";

export default function Exam() {
  const { currentUser } = useSelector((state) => state.user);
  
  const [questions, setQuestions] = useState([]);
  const [questionIdx, setQuestionIdx] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [examStatus, setExamStatus] = useState("unsaved")
  const [loading, setLoading] = useState(false)
  const [marks, setMarks] = useState(0);

  useEffect(() => { //get questions from the server
    try {
      const fetchQuestions = async () => {
        setLoading(true);
        const res = await fetch('/api/question/freetrial/');
        if(!res.ok){
          setLoading(false)
        }else{
          const data = await res.json();
          // Marked choice attribute
          const modifiedData = data.map(question => ({
            ...question,
            choice: -1,
          }))
          setQuestions(modifiedData);
          setLoading(false);
        }
      }
      fetchQuestions();
    } catch (error) {
      setLoading(false)
      console.log("Error fetching free trial");
    }
  }, [])

  useEffect(() => { // calculate marks got from the quizz
    const getMarks = () => {
      const marks = questions.reduce((acc, question) => {
        if(question.choice === question.correctAnswer){
          return acc + 1
        }
        return acc
      }, 0)
      return marks
    }
    const addExam = async () => {
      setLoading(true);
      const questionsData = questions.map(({ choice, _id }) => {
        return { questionID: _id, answer: choice };
      });
      try {
        const res = await fetch("/api/exam/addexam", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: currentUser._id,
            examNo: 0,
            questions: questionsData,
            totalMarks: marks,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          console.log("Error saving exam results");
          setLoading(false);
        } else {
          setLoading(false);
          setExamStatus("saved");
        }
      } catch (error) {
        setLoading(false);
        console.log("Error saving exam results", error);
      }
    };
    const marks = ((getMarks() / questions.length) * 100).toFixed(0);
    setMarks(marks);
    addExam();
  }, [completed])

  const handleAnswers = (qNo, selectedIndex) => { //update state with selected answers
    const updatedQuestions = questions.map((question, index) => {
      if (index === qNo) {
        if(selectedIndex == question.choice){
          return { ...question, choice: -1 }
        }
        return { ...question, choice: selectedIndex };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const handleSubmit = () => {
    setCompleted(true);
  }

  if(examStatus == "saved"){ // page after submitting answers
    return (
      <Answers questions={questions} marks={marks} />
    )
  }

  return ( // page before submitting answers
    <div className="min-h-screen">
      <div className="bg-mid-blue p-8 text-sm font-semibold">
        <h3 className="text-white">This free trial contains 10 questions.   Each question has 5 choices as answers.</h3>
        <p className="text-white opacity-50">Time duration - 30minutes</p>
      </div>
      <main className="flex flex-col gap-10 p-10 max-w-6xl mx-auto">
        <div className="flex justify-between w-full font-semibold">
          <span className="flex items-center gap-2 px-8 py-2 w-fit rounded-full bg-mid-blue text-white">
            <AiFillClockCircle />
            <p className="text-nowrap">28 min 43 sec</p>
          </span>
          {!loading &&
            <div className="w-full flex justify-end">
              {questions.length > 0 && questions.map((question, index) => (
                <div className="flex items-center" key={index}>
                  <button
                    onClick={() => setQuestionIdx(index)}
                    className={`w-10 h-10 rounded-full ${question.choice > -1 ? 'bg-mid-blue text-white' : 'bg-light-blue' } transition-all`}>
                      {index + 1}
                  </button>
                  <div className={`h-2 w-12 mx-[-4px] ${question.choice > -1 ? 'bg-mid-blue text-white' : 'bg-light-blue' } transition-all`}></div>
                </div>
              ))}
            </div>
          }
        </div>
        {!loading && questions.length > 0 ? (
            <Question
              key={questionIdx}
              question={questions[questionIdx]}
              questionIdx={questionIdx}
              handleAnswers={handleAnswers}
          />
        ) : (
          <div className="w-12 h-12">
            <Spinner className="text-blue-500"/>
          </div>
        )}
        {questionIdx <= questions.length - 2 ? (
          <Button
            className="self-end pl-4 bg-mid-blue"
            pill
            onClick={() => setQuestionIdx(questionIdx + 1)}
          >
            <span className="flex flex-row items-center gap-3">
              Next Question
              <HiChevronRight className="w-6 h-6" />
            </span>
          </Button>
        ) : (
          (questionIdx == questions.length - 1 ) && (
          <Button
            className="self-end px-4 bg-mid-blue"
            pill
            onClick={() => handleSubmit()}
          >
            <span className="flex flex-row items-center gap-3">
              Submit Answers
            </span>
          </Button>
          )
        )}
      </main>
    </div>
  )
}
