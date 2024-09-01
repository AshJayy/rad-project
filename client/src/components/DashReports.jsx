import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PdfFile from "./PdfFile";
import pdfIcon from "/img/icon_pdf.png";
import { AiOutlineDownload } from "react-icons/ai";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Spinner } from "flowbite-react";

export default function DashReports() {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null); 
  
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/exam/getuserexams?userID=${currentUser._id}`
        );
        if (!res.ok) {
          setLoading(false);
          const text = await res.text();
          console.log("Error fetching exams", text);
        } else {
          const data = await res.json();
          setExams(data);
          setLoading(false);
        }
      } catch (error) {
        console.log("Error fetching exams", error);
      }
    };
    fetchExams();
  }, [currentUser]);

  const handleDownloadClick = (exam) => {
    setSelectedExam(exam);
  };

  return (
    <div className="flex flex-col p-16">
      <h1 className="text-2xl font-bold text-dark-blue ">
        Download pdf files of your reports
      </h1>
      <div className="flex flex-wrap p-16 gap-12">
        {exams.map((exam, index) => (
          <div
            className="bg-white rounded-lg shadow-md flex flex-row items-center justify-between"
            key={index}
          >
            <button onClick={() => handleDownloadClick(exam)}>
              <img src={pdfIcon} className="object-cover w-32" alt="pdf" />
              <div className=" text-dark-blue opacity-50 pb-3">
                <p>Exam {index + 1}</p>
              </div>
            </button>
            {selectedExam && selectedExam._id === exam._id && (
              <div className="p-5 text-dark-blue">
                <PDFDownloadLink
                  document={<PdfFile exam={selectedExam} user={currentUser} />}
                  fileName={`exam${index + 1}_report`}
                >
                  {({ loading }) =>
                    loading ? <Spinner /> : <AiOutlineDownload className="text-3xl opacity-50" />
                  }
                </PDFDownloadLink>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
