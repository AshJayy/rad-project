import { PDFDownloadLink } from "@react-pdf/renderer";
import Answer from "../components/AnswerComponent";
import PdfFile from "../components/PdfFile";
import { Spinner } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Answers({ questions, marks, timeTaken }) {
  const correctAnswers = Math.round((questions.length * marks) / 100);
  const { currentUser } = useSelector((state) => state.user);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const examNo = params.get("no");
  const examID = params.get("id");

  // State to hold exam data and loading status
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState(false);

  const handleDownloadClick = () => {
    setSelectedExam(true);
  };

  useEffect(() => {
    const getExams = async () => {
      setLoading(true); // Start loading when fetching exam data
      try {
        const res = await fetch(`/api/exam/getuserexams?examID=${examID}`);
        if (!res.ok) {
          console.error("Error fetching exam:", res.status, res.statusText);
        } else {
          const exams = await res.json();
          const selectedExam = exams.find((exam) => exam._id === examID); // Find the specific exam
          setExam({
            ...selectedExam,
            questions: selectedExam.questions || [], // Ensure questions is always an array
            totalMarks: selectedExam.totalMarks || 0,
            takenTime: selectedExam.takenTime || 0,
          });
        }
      } catch (error) {
        console.error("An error occurred while fetching exam:", error);
      } finally {
        setLoading(false); // Ensure loading state is always updated
      }
    };

    if (examID) {
      getExams();
    }
  }, [examID]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner size="lg" color="info" />
      </div>
    );
  }

  return (
    <div>
      <div className="bg-mid-blue p-10 text-sm font-semibold flex gap-4 flex-row">
        <div className="flex flex-col gap-2 ">

        <h3 className="text-white text-2xl ">
          Your Score : {marks} %{" "}
        </h3>
        <p className="text-white opacity-50 ">
          Correct Answers: {correctAnswers} / {questions.length}
        </p>
        <p className="text-white opacity-50 ">
          Time Taken: {timeTaken}
        </p>
        </div>

        <div className="flex flex-col gap-4 ml-auto">
        <button
          className={`rounded-3xl h-[35px] w-[120px] border-2 border-white text-white hover:bg-white hover:text-mid-blue 
        disabled:bg-gray-300 disabled:text-gray-600 disabled:border-gray-400 transition`}
          disabled={!exam} // Disable button if exam data is not yet fetched
          onClick={handleDownloadClick}
        >
          {selectedExam ? (
            <PDFDownloadLink
              document={<PdfFile exam={exam} user={currentUser} />}
              fileName={`exam${examNo}_report`}
              className=""
            >
              {({ loading }) =>
                loading ? <Spinner size="sm" color="info" /> : "Download"
              }
            </PDFDownloadLink>
          ) : (
            "Get Report"
          )}
        </button>
        <button
          className="rounded-3xl h-[35px] w-[120px] border-2 border-white text-white hover:bg-white hover:text-mid-blue"
        >
          <Link to={`/dashboard?tab=dash`}>Done</Link>
        </button>
      </div>
      </div>

      <div className="mt-10 flex flex-col justify-center items-center gap-12">
        {questions.map((question, index) => (
          <Answer key={index} question={question} index={index} />
        ))}
        <button
          className="rounded-3xl border-2 p-1 px-3 border-mid-blue text-mid-blue hover:bg-mid-blue hover:text-white transition"
        >
          <Link to={`/dashboard?tab=dash`}>Go to Dashboard</Link>
        </button>
      </div>
      
    </div>
  );
}
