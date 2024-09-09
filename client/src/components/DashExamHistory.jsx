import React, { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfFile from "./PdfFile";
import { AiOutlineDownload } from "react-icons/ai";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashExamHistory() {
  const { currentUser } = useSelector((state) => state.user);

  const [openedExams, setOpenedExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [examinations, setExaminations] = useState([]); // Correct initialization
  const [examNumber, setExamNumber] = useState(0);
  const [nextExam, setNextExam] = useState(0);
  const [creatingExam, setCreatingExam] = useState(false); // New state to manage ongoing exam creation
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  const [selectedExam, setSelectedExam] = useState(null);
  const [sub, setSub] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  // useEffect(() => {
  //   const getSub = async () => {
  //     try {
  //       const res = await fetch(`/api/sub/getsubs/${currentUser._id}`, {
  //         method: "GET",
  //       });
  //       if (!res.ok) {
  //         console.log("Error:", res.status, res.statusText);
  //       } else {
  //         const data = await res.json();
  //         setSub(data);
  
  //         const today = new Date();
  //         const validUntil = new Date(data.validUntil);
  
  //         if (validUntil.getTime() > today.getTime()) {
  //           setSubscribed(true);
  //           console.log("Subscription valid: true");
  //         } else {
  //           setSubscribed(false);
  //           console.log("Subscription valid: false");
  //         }
  //       }
  //     } catch (error) {
  //       console.log("Fetch error:", error.message);
  //     }
  //   };
  
  //   if (currentUser?._id) {
  //     getSub();
  //   }
  // }, [currentUser]); 

  const createExam = async (examNum) => {
    try {
      setLoading(true); // Start loading when creating an exam
      setCreatingExam(true); // Set creatingExam to true to indicate an exam is being created
      const res = await fetch("/api/exam/addexam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: user._id,
          examNo: examNum,
          questions: [],
          totalMarks: 0,
          timeTaken: 0,
          done: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Error creating exam:", res.status, res.statusText);
      } else {
        setExaminations((prevExams) => [...prevExams, data]); // Add new exam to examinations state
        setExamNumber((prev) => prev + 1); // Increment examNumber after creation
      }
    } catch (error) {
      console.error("An error occurred while creating exam:", error);
    } finally {
      setLoading(false); // Ensure loading state is always updated
      setCreatingExam(false); // Reset creatingExam state after creation attempt
    }
  };

  useEffect(() => {
    const getExams = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/exam/getuserexams?userID=${user._id}`);
        if (!res.ok) {
          console.error("Error fetching exams:", res.status, res.statusText);
        } else {
          const exams = await res.json();
          setExaminations(
            exams.map((exam) => ({
              ...exam,
              questions: exam.questions || [],
              totalMarks: exam.totalMarks || 0,
              takenTime: exam.takenTime || 0,
            }))
          );

          // Create a new exam if none exist
          if (exams.length === 0) {
            await createExam(examNumber);
          }
        }
      } catch (error) {
        console.error("An error occurred while fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id && examinations.length === 0) {
      getExams(); // Only fetch exams once when user data is available
    }
  }, [user?._id]);

  useEffect(() => {
    const checkNextExamAvailability = async () => {
      try {
        const res = await fetch(`/api/question/getnextExam?userID=${user._id}`);
        if (!res.ok) {
          console.error(
            "Error checking next exam availability:",
            res.status,
            res.statusText
          );
        } else {
          const { message } = await res.json();
          if (
            message ===
            "Enough questions are available to create the next exam."
          ) {
            setNextExam(1); // Set nextExam to 1 if enough questions are available
          } else {
            setNextExam(0); // Otherwise, set it to 0 or handle it as needed
          }
        }
      } catch (error) {
        console.error(
          "An error occurred while checking next exam availability:",
          error
        );
      }
    };

    if (user?._id) {
      checkNextExamAvailability();
    }
  }, [user?._id]);

  useEffect(() => {
    if (nextExam === 1 && !creatingExam) {
      const unfinishedExam = examinations.some((exam) => !exam.done);
      if (!unfinishedExam) {
        createExam(examNumber); // Only create an exam if no unfinished exams exist
      }
    }
  }, [nextExam, creatingExam, examinations]); // Add creatingExam and examinations as dependencies

  const updateOpenedExams = (id) => {
    setOpenedExams((prevOpenedExams) =>
      prevOpenedExams.includes(id)
        ? prevOpenedExams.filter((item) => item !== id)
        : [...prevOpenedExams, id]
    );
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const secs = seconds % 60;
    return `${hours} hr ${minutes % 60} min ${secs < 10 ? "0" : ""}${secs} sec`;
  };

  const handleDownloadClick = (exam) => {
    setSelectedExam(exam);
  };
  const lineChartData = {
    labels: examinations.slice(-10).map((item) => item.examNo),
    datasets: [
      {
        label: "Score",
        data: examinations.slice(-10).map((item) => item.totalMarks),
        fill: false,
        backgroundColor: "rgba(6, 73, 152,0.5)",
        borderColor: "rgba(6, 73, 152,1)",
        tension: 0.5,
      },
    ],
  };
  const options = {
    animation: {
      duration: 1000, // 1 second animation duration
      easing: "easeInOutQuad", // Smooth easing function
    },
    scales: {
      x: {
        grid: {
          display: false, // Remove x-axis grid lines
        },
      },
      y: {
        grid: {
          display: false, // Remove y-axis grid lines
        },
        beginAtZero: true, // Always start the y-axis at 0
      },
    },
  };

  if (loading) {
    // Show a spinner while loading
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }
  if (currentUser.currentPlan === -1) {
    return (
        <div className="flex flex-col p-4 gap-4 w-full items-center ">
            <h3>Please subscribe to view this information.</h3>
            <button
                className="mt-4 rounded-md h-[35px] w-[120px] border-2 border-mid-blue hover:text-white hover:bg-mid-blue"
                onClick={() => navigate('/pricing')}
            >
                subscribe
            </button>
        </div>
    );
}
  return (
    <div className="flex flex-col p-4 gap-4 w-full items-center">
      {!loading && (
        <div className="flex flex-col w-auto md:w-2/3 shadow-md p-2 rounded-md dark:bg-gray-800 bg-white">
          {/* Line Chart */}
          <Line data={lineChartData} options={options} />
        </div>
      )}

      {Array.isArray(examinations) &&
        examinations.map((exam, index) => (
          <div
            className={`w-full rounded-lg px-7 py-5 cursor-pointer shadow-md ${
              exam.done ? "bg-light-blue" : "bg-white"
            }`}
            key={exam._id || index}
          >
            <span
              className="flex flex-row justify-between w-full font-semibold text-xl cursor-pointer"
              onClick={() => updateOpenedExams(exam._id)}
            >
              <div>Examination {exam.examNo}</div>
              <div className="scale-[200%] mt-1">
                {openedExams.includes(exam._id) ? (
                  <IoMdArrowDropup />
                ) : (
                  <IoMdArrowDropdown />
                )}
              </div>
            </span>
            <div
              className={`flex flex-col transition-all duration-700 ease-in-out overflow-hidden ${
                openedExams.includes(exam._id) ? "max-h-screen" : "max-h-0"
              }`}
            >
              <div className="mt-3 mb-5 flex flex-col gap-1">
                <h1>
                  Score:{" "}
                  <span className="text-gray-500 ml-5">
                    {Math.round(exam.totalMarks)}%
                  </span>
                </h1>
                <h1>
                  No of correct answers:{" "}
                  <span className="text-gray-500 ml-5">
                    {Math.round(
                      (exam.questions?.length || 0) * (exam.totalMarks / 100)
                    )}{" "}
                    / {exam.questions?.length || 0}
                  </span>
                </h1>
                <h1>
                  Date and time:{" "}
                  <span className="text-gray-500 ml-5">
                    {`${new Date(exam.createdAt)
                      .getDate()
                      .toString()
                      .padStart(2, "0")}/${(
                      new Date(exam.createdAt).getMonth() + 1
                    )
                      .toString()
                      .padStart(2, "0")}/${new Date(
                      exam.createdAt
                    ).getFullYear()} at 
                    ${new Date(exam.createdAt)
                      .getHours()
                      .toString()
                      .padStart(2, "0")}:${new Date(exam.createdAt)
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}`}
                  </span>
                </h1>
                <h1>
                  Time Taken:
                  <span className="text-gray-500 ml-5">
                    {formatTime(exam.takenTime)}
                  </span>
                </h1>
              </div>

              <div className="flex justify-end gap-4">
                {!exam.done && (
                  <button
                    className="rounded-3xl h-[35px] w-[120px] border-2 border-mid-blue hover:text-white hover:bg-mid-blue
                disabled:bg-gray-300 disabled:text-gray-600  disabled:border-gray-400"
                    onClick={() =>
                      navigate(`/exam?no=${exam.examNo}&id=${exam._id}`)
                    }
                    disabled={exam.done}
                  >
                    Take Exam
                  </button>
                )}

                <button
                  className={`rounded-3xl h-[35px] w-[120px] border-2 border-mid-blue hover:text-white hover:bg-mid-blue
                disabled:bg-gray-300 disabled:text-gray-600 disabled:border-gray-400 ${
                  selectedExam && selectedExam._id === exam._id
                    ? "bg-mid-blue text-white"
                    : ""
                }`}
                  disabled={!exam.done}
                  onClick={() => handleDownloadClick(exam)}
                >
                  {selectedExam && selectedExam._id === exam._id ? (
                    <div className="">
                      <PDFDownloadLink
                        document={
                          <PdfFile exam={selectedExam} user={currentUser} />
                        }
                        fileName={`exam${exam.examNo}_report`}
                      >
                        {({ loading }) =>
                          loading ? (
                            <Spinner size="sm" color="info" />
                          ) : (
                            "Download"
                          )
                        }
                      </PDFDownloadLink>
                    </div>
                  ) : (
                    "Get Report"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
