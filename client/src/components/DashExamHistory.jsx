import React, { useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";
// import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

export default function DashExamHistory() {
  const [openedExams, setOpenedExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [examinations, setExaminations] = useState([])

  useEffect(() => {
    const getExams = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/exam/getExams');

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
}, []); 

  // const examinations = [//sample exams
  //   {
  //     _id: "1",
  //     name: "Examination 1",
  //     Score: "80",
  //     NoOfCorrect: "8/10",
  //     date: "2024/05/03",
  //     timetaken: "30 mins 03 sec",
  //   },
  //   {
  //     _id: "2",
  //     name: "Examination 2",
  //     Score: "90",
  //     NoOfCorrect: "9/10",
  //     date: "2024/05/03",
  //     timetaken: "30 mins 03 sec",
  //   },
  //   {
  //     _id: "3",
  //     name: "Examination 3",
  //     Score: "100",
  //     NoOfCorrect: "10/10",
  //     date: "2024/05/03",
  //     timetaken: "30 mins 03 sec",
  //   },
  //   {
  //     _id: "4",
  //     name: "Examination 4",
  //     Score: "70",
  //     NoOfCorrect: "7/10",
  //     date: "2024/05/03",
  //     timetaken: "30 mins 03 sec",
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
            <div>{exam.name}</div>
            <div className='scale-[200%] mt-1'>
              {openedExams.includes(exam._id) ? (
                // <RiArrowDropUpLine />
                <IoMdArrowDropup />
              ) : (
                // <RiArrowDropDownLine />
                <IoMdArrowDropdown />
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
                Score: <span className='text-gray-500 ml-5'>{exam.Score}%</span>
              </h1>
              <h1>
                No of correct answers:{" "}
                <span className='text-gray-500 ml-5'>{exam.NoOfCorrect}</span>
              </h1>
              <h1>
                Date and time:{" "}
                <span className='text-gray-500 ml-5'>{exam.date}</span>
              </h1>
              <h1>
                Time Taken:{" "}
                <span className='text-gray-500 ml-5'>{exam.timetaken}</span>
              </h1>
            </div>
            <div className='flex justify-end'>
              <button className='rounded-3xl h-[35px] w-[15%] border-2 border-mid-blue hover:text-white hover:bg-mid-blue'>
                Download
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
