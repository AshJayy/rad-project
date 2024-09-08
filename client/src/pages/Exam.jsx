import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { AiFillClockCircle } from "react-icons/ai";
import { HiChevronRight } from "react-icons/hi";
import Question from "../components/Question";
import Answers from "./Answers";
import { FcQuestions } from "react-icons/fc";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
// import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import {
  examStart,
  updateRemainingTime,
  examSuccess,
  examFailure,
  signoutSuccess,
  updateExamQuestions,
} from "../redux/exam/examSlice";

export default function Exam() {
  const { currentUser } = useSelector((state) => state.user);
  const { isReady, examQuestions, remainingTime, questionNo } = useSelector(
    (state) => state.exam
  );

  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [questionNum, setQuestionNum] = useState(0);
  const [questionIdx, setquestionIdx] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [marks, setMarks] = useState(0);
  const examTime = 30 * 60; // 30 min
  const [timeLeft, setTimeLeft] = useState(examTime);
  const [takenTime, setTakenTime] = useState(120);
  const [startTimer, setStartTimer] = useState(true);
  const [ready, setReady] = useState(isReady);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [correct,setCorrect] = useState(0);

  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const examNo = params.get("no");
  const examID = params.get("id");
  const [currentPage, setCurrentPage] = useState(0);
  const buttonsPerPage = 10;

  // const [examStatus, setExamStatus] = useState("unsaved")

  //console.log(examNo,examID)
  const startIdx = currentPage * buttonsPerPage;
  const endIdx = Math.min(startIdx + buttonsPerPage, questions.length);
  const currentQuestions = questions.slice(startIdx, endIdx);

  useEffect(() => {
    if (examQuestions.length > 0) {
      localStorage.setItem("examQuestions", JSON.stringify(examQuestions));
    }
    if (remainingTime > 0) {
      localStorage.setItem("remainingTime", JSON.stringify(remainingTime));
    }
  }, [examQuestions, remainingTime]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);

      // Check if questions are in local storage
      const storedQuestions = localStorage.getItem("examQuestions");
      const storedTimeLeft = localStorage.getItem("remainingTime");

      if (storedQuestions && storedTimeLeft) {
        // Parse and set the stored questions and time
        const parsedQuestions = JSON.parse(storedQuestions);
        const parsedTimeLeft = JSON.parse(storedTimeLeft);

        setQuestions(parsedQuestions);
        setTimeLeft(parsedTimeLeft);
        setReady(true); // Set exam ready if questions are already stored
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/question/getuserquestions?userID=${currentUser._id}`
        );
        if (res.ok) {
          const question = await res.json();
          const modifiedData = Array.isArray(question)
            ? question.map((question) => ({
                ...question,
                choice: -1,
              }))
            : [];

          // Save questions and remaining time to local storage
          localStorage.setItem("examQuestions", JSON.stringify(modifiedData));
          localStorage.setItem("remainingTime", JSON.stringify(timeLeft));

          dispatch(examStart({ examQuestions: modifiedData, remainingTime: timeLeft })          );
          setQuestions(modifiedData);
        } else {
          dispatch(examFailure());
          console.log("Failed to fetch questions");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      // todo: check question len == 0
      fetchQuestions(); // Call fetchQuestions only if currentUser is defined
    }
  }, [currentUser]);

  useEffect(() => {
    if (!startTimer || !ready) return;

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
  }, [startTimer, ready]);

  // Dispatching the action in a separate effect
  useEffect(() => {
    if (timeLeft > 0) {
      dispatch(updateRemainingTime(timeLeft));
    }
  }, [timeLeft, dispatch]);

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
    setQuestionNum(qNo);
    // Save updated answers to localStorage
  localStorage.setItem("examQuestions", JSON.stringify(updatedQuestions));
  dispatch(updateExamQuestions({ examQuestions: updatedQuestions, questionNo: qNo }));
    
  };

  useEffect(() => {
    if (questions.length > 0) {
      const storedQuestionIdx = localStorage.getItem("questionIdx");
      if (storedQuestionIdx) {
        setquestionIdx(parseInt(storedQuestionIdx, 10)); // Restore the question index
      }
    }
  }, [questions]);  // Run this effect only after questions are loaded

  useEffect(() => {
    if (questions.length > 0 && questionIdx !== 0) {
      // Store the current questionIdx in localStorage after questions are loaded and questionIdx is updated
      localStorage.setItem("questionIdx", questionIdx);
    }
  }, [questionIdx, questions]);

  const calculateMarks = () => {
    const totalMarks = questions.reduce((acc, question) => {
      if (question.choice === question.correctAnswer) {
        return acc + 1;
      }
      return acc;
    }, 0);
    setCorrect(totalMarks);
    return (totalMarks / questions.length) * 100;
  };

  const updateExam = async (marks, takenTime) => {
    const data = {
      questions,
      timeTaken: takenTime,
      totalMarks: marks,
      done: true,
    };
    //console.log(data);

    const res = await fetch(`/api/exam/update/${examID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      console.error("Error updating exam:", res.status, res.statusText);
    }
  };

  const handleSubmit = async () => {
    setCompleted(true);
    setStartTimer(false);

    // Clear the local storage when the exam is completed
    localStorage.removeItem("examQuestions");
    localStorage.removeItem("remainingTime");
    localStorage.removeItem("questionIdx");

    const timeTaken = examTime - timeLeft;
    console.log(examTime)
    setTakenTime(formatTime(timeTaken));
    const marks = calculateMarks();
    setMarks(marks.toFixed(0));
    await updateExam(marks, timeTaken);
    dispatch(examSuccess());
  };

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft]);

  useEffect(() => {
    if (!currentUser || currentUser.userLevel !== 0) {
      navigate("/");
    }
  }, [currentUser, navigate]);
  useEffect(() => {
    // Automatically update currentPage based on the question index
    const newPage = Math.floor(questionIdx / buttonsPerPage);
    setCurrentPage(newPage);
  }, [questionIdx]);
  

  const startExam = async () => {
    // Move this outside the rendering phase
    setReady(true);
    // Dispatch the exam start
    dispatch(examStart({ examQuestions: questions, remainingTime: timeLeft }));
  };

// console.log(questionNo);

  

  return (
    <>
      {completed ? (
        <div>
          <Answers questions={questions} marks={marks} timeTaken={takenTime} correct = {correct} />
        </div>
      ) : (
        <>
          {ready ? (
            <>
              {currentUser && currentUser.userLevel === 0 ? (
                <div className="min-h-screen">
                  <main className="flex flex-col gap-10 p-10 max-w-6xl mx-auto">
                    <div className="flex flex-col gap-4 justify-between w-full font-semibold ">
                      {!loading && (
                        <span className="flex items-center gap-2 px-8 py-2 w-fit rounded-full bg-mid-blue text-white">
                          <AiFillClockCircle />
                          <p className="text-nowrap">{formatTime(timeLeft)}</p>
                        </span>
                      )}
                      {!loading && (
                        <div className="w-full flex py-2 items-center justify-between">
                          <div className="px-3">
                            <button
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 0))
                              }
                              disabled={currentPage === 0}
                              className={`px-2 py-2 rounded-full  ${
                                currentPage === 0
                                  ? "bg-gray-300"
                                  : "bg-mid-blue text-white"
                              }`}
                            >
                              <GrFormPrevious />
                            </button>
                          </div>
                          <div className="flex">
                            {currentQuestions.map((question, index) => (
                              <div
                                className="flex items-center "
                                key={index + startIdx}
                              >
                                <button
                                  onClick={() =>
                                    setquestionIdx(index + startIdx)
                                  }
                                  className={`w-10 h-10 rounded-full ${
                                    question.choice > -1
                                      ? "bg-mid-blue text-white"
                                      : "bg-light-blue"
                                  } 
                                ${questionIdx === index + startIdx && (" border-4 border-blue-500")
                                  } transition-all`}
                                >
                                  {index + startIdx + 1}
                                </button>
                                {(index + startIdx + 1) % 10 !== 0 && (
                                  <div
                                    className={`h-2 w-12 ${
                                      question.choice > -1
                                        ? "bg-mid-blue text-white"
                                        : "bg-light-blue"
                                    } transition-all`}
                                  ></div>
                                )}
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(
                                  prev + 1,
                                  Math.ceil(questions.length / buttonsPerPage) -
                                    1
                                )
                              )
                            }
                            disabled={endIdx >= questions.length}
                            className={`px-2 py-2 rounded-full  ${
                              endIdx >= questions.length
                                ? "bg-gray-300"
                                : "bg-mid-blue text-white"
                            }`}
                          >
                            <GrFormNext />
                          </button>
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
                    This Exam contains 30 questions. Each question has 5 choices
                    as answers.
                  </h3>
                  <p className="text-mid-blue opacity-50">
                    Time duration - 30minutes
                  </p>
                </div>
                <Button
                  className=" font-semibold bg-mid-blue rounded-full"
                  // onClick={() => setReady(true)}
                  onClick={() => {
                    startExam();
                  }}
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
