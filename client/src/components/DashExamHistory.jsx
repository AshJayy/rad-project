import React, { useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useSelector } from "react-redux";

export default function DashExamHistory() {
  const [openedExams, setOpenedExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [examinations, setExaminations] = useState([]);
  const user = useSelector((state) => state.user.currentUser);
  // console.log(examinations)
  useEffect(() => {
    const getExams = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/exam/getuserexams?userID=${user._id}`);

            if (!res.ok) {
                setLoading(false);
                console.error('Error fetching exams:', res.status, res.statusText);
            } else {
                const exams = await res.json();
                setExaminations(exams);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false); // Ensure loading is stopped in case of error
            console.error('An error occurred while fetching exams:', error);
        }
    };

    getExams();
}, [user?._id]); 

  // const examinations = [//sample exams
  //   {
  //     _id: "1",
  //     name: "Examination 1",
  //     Score: "80",
  //     NoOfCorrect: "8/10",
  //     date: "2024/05/03",
  //     timetaken: 120,
  //   },
  //   {
  //     _id: "2",
  //     name: "Examination 2",
  //     Score: "90",
  //     NoOfCorrect: "9/10",
  //     date: "2024/05/03",
  //     timetaken: 120,
  //   },
  //   {
  //     _id: "3",
  //     name: "Examination 3",
  //     Score: "100",
  //     NoOfCorrect: "10/10",
  //     date: "2024/05/03",
  //     timetaken: 90,
  //   },
  //   {
  //     _id: "4",
  //     name: "Examination 4",
  //     Score: "70",
  //     NoOfCorrect: "7/10",
  //     date: "2024/05/03",
  //     timetaken: 45,
  //   },
  // ];
  
  const updateOpenedExams = (id) => {
    setOpenedExams(
      openedExams.includes(id)
        ? openedExams.filter((item) => item !== id)
        : [...openedExams, id]
    );
  };

  if(loading){//while loading
    return(
      <div className="">
        <Spinner />
      </div>
    )
  }

  if(examinations.length === 0){
    return(
      <div className="flex p-4 sm:justify-center sm:items-center w-full h-full">
        <p>No exams done !</p>
      </div>
    )
  }
  return (
    <div className='flex flex-col p-4 gap-4 w-full'>
      {examinations.map((exam) => (
        <div
          className='bg-white w-full rounded-lg px-7 py-5 cursor-pointer shadow-md'
          key={exam._id}
        >
          <span
            className='flex flex-row justify-between w-full font-semibold text-xl cursor-pointer'
            onClick={() => updateOpenedExams(exam._id)}
          >
            <div>Examination {exam.examNo}</div>
            <div className='scale-[200%] mt-1'>
              {openedExams.includes(exam._id) ? (
                <RiArrowDropUpLine />
              ) : (
                <RiArrowDropDownLine />
              )}
            </div>
          </span>
          <div //use contional rendering to shoe details
            className={`flex flex-col transition-all duration-700 ease-in-out overflow-hidden ${
              openedExams.includes(exam._id) ? "max-h-screen" : "max-h-0"
            }`}
          >
            <div className='mt-3 mb-5 flex  flex-col gap-1'>
              <h1>
                Score: <span className='text-gray-500 ml-5'>{exam.totalMarks}%</span>
              </h1>
              <h1>
                No of correct answers:{" "}
                <span className='text-gray-500 ml-5'>{exam.questions.length * exam.totalMarks / 100} / {exam.questions.length}</span>
              </h1>
              <h1>
                Date and time:{" "}
                <span className='text-gray-500 ml-5'>
                  {`${new Date(exam.createdAt).getDate().toString().padStart(2, '0')}/${(new Date(exam.createdAt).getMonth() + 1).toString().padStart(2, '0')}/${new Date(exam.createdAt).getFullYear()} at 
                    ${new Date(exam.createdAt).getHours().toString().padStart(2, '0')}:${new Date(exam.createdAt).getMinutes().toString().padStart(2, '0')}`}
                </span>

              </h1>
              <h1>
                Time Taken:{" "}
                <span className='text-gray-500 ml-5'>{exam.timeTaken ? (exam.timeTaken / 60).toFixed(0) : '2' } hours {exam.timeTaken && exam.timeTaken % 60 !== 0 ? `${exam.timetaken % 60} minutes` : ''} </span>
              </h1>
            </div>
            <div className='flex justify-end'>
              <button className='rounded-3xl h-[35px] w-[120px] border-2 border-mid-blue hover:text-white hover:bg-mid-blue'>
                Download
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
