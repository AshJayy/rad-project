import React, { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useSelector } from "react-redux";

export default function DashExamHistory() {
  const [openedExams, setOpenedExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [examinations, setExaminations] = useState([]);
  const [examNumber, setExamNumber] = useState(0); // Use useState for examNumber
  const user = useSelector((state) => state.user.currentUser);

  const createExam = async (examNum) => {
    try {
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
        setExaminations([...examinations, data]);
      }
    } catch (error) {
      console.error("An error occurred while creating exam:", error);
    } finally {
      setLoading(false); // Ensure loading state is always updated
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
          setExaminations(exams);

          // If there are no exams, create one
          if (exams.length === 0) {
            await createExam(examNumber);
            setExamNumber((prev) => prev + 1); // Increment examNumber after creation
          }
        }
      } catch (error) {
        console.error("An error occurred while fetching exams:", error);
      } finally {
        setLoading(false); // Ensure loading state is always updated
      }
    };

    if (user?._id) {
      getExams();
    }
  }, [user?._id, examNumber]); // Add examNumber as a dependency

  const updateOpenedExams = (id) => {
    setOpenedExams((prevOpenedExams) =>
      prevOpenedExams.includes(id)
        ? prevOpenedExams.filter((item) => item !== id)
        : [...prevOpenedExams, id]
    );
  };

  if (loading) {
    // While loading
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 gap-4 w-full">
      {examinations.map((exam) => (
        <div
          className={`w-full rounded-lg px-7 py-5 cursor-pointer shadow-md ${
            exam.done ? "bg-light-blue" : "bg-white"
          }`}
          key={exam._id}
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
                Score: <span className="text-gray-500 ml-5">{exam.totalMarks}%</span>
              </h1>
              <h1>
                No of correct answers:{" "}
                <span className="text-gray-500 ml-5">
                  {(exam.questions.length * exam.totalMarks) / 100} / {exam.questions.length}
                </span>
              </h1>
              <h1>
                Date and time:{" "}
                <span className="text-gray-500 ml-5">
                  {`${new Date(exam.createdAt).getDate().toString().padStart(2, "0")}/${(
                    new Date(exam.createdAt).getMonth() + 1
                  )
                    .toString()
                    .padStart(2, "0")}/${new Date(exam.createdAt).getFullYear()} at 
                    ${new Date(exam.createdAt).getHours().toString().padStart(2, "0")}:${new Date(
                    exam.createdAt
                  )
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`}
                </span>
              </h1>
              <h1>
                Time Taken:{" "}
                <span className="text-gray-500 ml-5">
                  {exam.timeTaken ? Math.floor(exam.timeTaken / 60) : "0"} hours{" "}
                  {exam.timeTaken && exam.timeTaken % 60 !== 0
                    ? `${exam.timeTaken % 60} minutes`
                    : ""}
                </span>
              </h1>
            </div>
            
            <div className="flex justify-end gap-4">
            <button 
            className="rounded-3xl h-[35px] w-[120px] border-2 border-mid-blue hover:text-white hover:bg-mid-blue
            disabled:bg-gray-300 disabled:text-gray-600  disabled:border-gray-400"
            disabled={exam.done}
            >
                Take Exam
              </button>
              <button className="rounded-3xl h-[35px] w-[120px] border-2 border-mid-blue hover:text-white hover:bg-mid-blue
               disabled:bg-gray-300 disabled:text-gray-600 disabled:border-gray-400"
               disabled={!exam.done}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
