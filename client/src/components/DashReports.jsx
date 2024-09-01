import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PdfFile from "./PdfFile";
import pdfIcon from "/img/icon_pdf.png";
import { AiOutlineDownload } from "react-icons/ai";
import { PDFDownloadLink } from "@react-pdf/renderer";

export default function DashReports() {
  const { currentUser } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);

  // const exams = new Array(10).fill(0);
  const [exams, setExams] = useState([]);

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

  return (
    <div className="flex flex-col p-16">
      <h1 className="text-2xl font-bold text-dark-blue ">
        Download pdf files of your reports
      </h1>
      <div className="flex flex-wrap p-16 gap-12">
        {exams.map((exam, index) => (
          <div className="bg-white rounded-lg shadow-md" key={index}>
            <PDFDownloadLink document={<PdfFile exam={exam} user={currentUser} />} fileName={`exam${index + 1}_report`}>
              {({loading}) => (loading ? (
                <button>
                <img src={pdfIcon} className="object-cover w-32 opacity-75" alt="pdf" />
                <div className="flex justify-between items-center px-5 pb-3 text-dark-blue opacity-50">
                  <p>Exam {index + 1}</p>
                  <AiOutlineDownload />
                </div>
              </button>
              ) : (
                <button>
                  <img src={pdfIcon} className="object-cover w-32" alt="pdf" />
                  <div className="flex justify-between items-center px-5 pb-3 text-dark-blue opacity-50">
                    <p>Exam {index + 1}</p>
                    <AiOutlineDownload />
                  </div>
                </button>
              ))}
            </PDFDownloadLink>
          </div>
        ))}
      </div>
    </div>
  );
}
