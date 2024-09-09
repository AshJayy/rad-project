import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PdfFile from "./PdfFile";
import pdfIcon from "/img/icon_pdf.png";
import { AiOutlineDownload } from "react-icons/ai";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Spinner } from "flowbite-react";
import { Navigate, useNavigate } from "react-router-dom";

export default function DashReports() {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null); 
  const [sub, setSub] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const Navigate = useNavigate();

  useEffect(() => {
    const getSub = async () => {
      try {
        const res = await fetch(`/api/sub/getsubs/${currentUser._id}`, {
          method: "GET",
        });
        if (!res.ok) {
          console.log("Error:", res.status, res.statusText);
        } else {
          const data = await res.json();
          setSub(data);
  
          const today = new Date();
          const validUntil = new Date(data.validUntil);
  
          if (validUntil.getTime() > today.getTime()) {
            setSubscribed(true);
            console.log("Subscription valid: true");
          } else {
            setSubscribed(false);
            console.log("Subscription valid: false");
          }
        }
      } catch (error) {
        console.log("Fetch error:", error.message);
      }
    };
  
    if (currentUser?._id) {
      getSub();
    }
  }, [currentUser]); 
  
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
  if (!subscribed) {
    return (
        <div className="flex flex-col p-4 gap-4 w-full items-center">
            <h3>Please subscribe to view this information.</h3>
            <button
                className="mt-4 rounded-md h-[35px] w-[120px] border-2 border-mid-blue hover:text-white hover:bg-mid-blue"
                onClick={() => Navigate('/pricing')}
            >
                subscribe
            </button>
        </div>
    );
}

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
