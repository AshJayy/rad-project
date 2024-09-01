import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { AiFillClockCircle } from "react-icons/ai";
import { HiChevronRight } from "react-icons/hi";
import Question from "../components/Question";
import Answers from "./Answers";
import { FcQuestions } from "react-icons/fc";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Exam() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [questionIdx, setquestionIdx] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [marks, setMarks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [takenTime, setTakenTime] = useState(120);
  const [startTimer, setStartTimer] = useState(true);
  const [ready, setReady] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const examNo = params.get("no");
  const examID = params.get("id");
  // const [examStatus, setExamStatus] = useState("unsaved")

  //console.log(examNo,examID)

  useEffect(() => {
    //get questions from the server
    const fetchQuestions = async () => {
      setLoading(true);
      const res = await fetch("/api/question/getuserquestions");
      if (!res.ok) {
        setLoading(false);
      } else {
        const question = await res.json();
        // Marked choice attribute
        const modifiedData = Array.isArray(question)
          ? question.map((question) => ({
              ...question,
              choice: -1,
            }))
          : [];
        setQuestions(modifiedData);
        setLoading(false);
      }
    };
    try {
      fetchQuestions();
    } catch (error) {
      setLoading(false);
      console.log("Error fetching questions", error);
    }
  }, []);



  useEffect(() => {
    if (!startTimer) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} min ${secs < 10 ? "0" : ""}${secs} sec`;
  };

  const handleAnswers = (qNo, selectedIndex) => {
    const updatedQuestions = questions.map((question, index) => {
      if (index === qNo) {
        if (selectedIndex == question.choice) {
          return { ...question, choice: -1 };
        }
        return { ...question, choice: selectedIndex };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const calculateMarks = () => {
    const totalMarks = questions.reduce((acc, question) => {
      if (question.choice === question.correctAnswer) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return (totalMarks / questions.length) * 100;
  };

  

  const handleSubmit = async () => {
    setCompleted(true);
    setStartTimer(false);
    const timeTaken = 30 * 60 - timeLeft;
    setTakenTime(formatTime(timeTaken));
    const marks = calculateMarks();
    setMarks(marks.toFixed(0));
  };

  useEffect(() => {
    if (!currentUser || currentUser.userLevel !== 0) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <>
      {completed ? (
        <div>
          <Answers questions={questions} marks={marks} timeTaken={takenTime} />
        </div>
      ) : (
        <>
          {ready ? (
            <>
              {currentUser && currentUser.userLevel === 0 ? (
                <div className="min-h-screen">
                  <main className="flex flex-col gap-10 p-10 max-w-6xl mx-auto">
                    <div className="flex justify-between w-full font-semibold ">
                      {!loading && (
                        <span className="flex items-center gap-2 px-8 py-2 w-fit rounded-full bg-mid-blue text-white">
                          <AiFillClockCircle />
                          <p className="text-nowrap">{formatTime(timeLeft)}</p>
                        </span>
                      )}
                      {!loading && (
                        <div className="w-full flex ">
                          {questions.length > 0 &&
                            questions.map((question, index) => (
                              <div className="flex items-center" key={index}>
                                <button
                                  onClick={() => setquestionIdx(index)}
                                  className={`w-10 h-10 rounded-full ${
                                    question.choice > -1
                                      ? "bg-mid-blue text-white"
                                      : "bg-light-blue"
                                  } transition-all`}
                                >
                                  {index + 1}
                                </button>
                                <div
                                  className={`h-2 w-12 mx-[-4px] ${
                                    question.choice > -1
                                      ? "bg-mid-blue text-white"
                                      : "bg-light-blue"
                                  } transition-all`}
                                ></div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                    {!loading && questions.length > 0 ? (
                      <Question
                        question={questions[questionIdx]}
                        questionIdx={questionIdx}
                        handleAnswers={handleAnswers}
                      />
                    ) : (
                      <div className="flex mt-1/2 justify-center">
                        <Spinner className="w-20 h-20" />
                      </div>
                    )}
                    {!loading &&
                      (questionIdx <= questions.length - 2 ? (
                        <Button
                          className="self-end pl-4 bg-mid-blue"
                          pill
                          onClick={() => setquestionIdx(questionIdx + 1)}
                        >
                          <span className="flex flex-row items-center gap-3">
                            Next Question
                            <HiChevronRight className="w-6 h-6" />
                          </span>
                        </Button>
                      ) : (
                        <Button
                          className="self-end px-4 bg-mid-blue"
                          pill
                          onClick={() => handleSubmit()}
                        >
                          <span className="flex flex-row items-center gap-3">
                            Submit Answers
                          </span>
                        </Button>
                      ))}
                  </main>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <div className="flex flex-col items-center h-screen mt-32">
                <FcQuestions className="w-20 h-20 text-mid-blue" />
                <div className=" p-8 font-semibold text-center ">
                  <h3 className="text-mid-blue text-lg mb-2">
                    This Exam contains 10 questions. Each question has 5 choices
                    as answers.
                  </h3>
                  <p className="text-mid-blue opacity-50">
                    Time duration - 30minutes
                  </p>
                </div>
                <Button
                  className=" font-semibold bg-mid-blue rounded-full"
                  onClick={() => setReady(true)}
                >
                  Start Exam
                </Button>
                <p className="text-sm text-mid-blue opacity-50 mt-5 text-center">
                  Click The Button To Get Started With The Exam
                </p>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
