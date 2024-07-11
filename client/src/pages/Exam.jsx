import { Alert, Button, Label, List, Radio, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { AiFillClockCircle } from "react-icons/ai";
import { HiChevronRight, HiOutlinePencilAlt, HiOutlinePencil } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function Exam() {
  const [questions, setQuestions] = useState([]);
  const [questionNo, setQuestionNo] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [marks, setMarks] = useState(0);
  

  useEffect(() => { //get questions from the server
    try {
      const fetchQuestions = async () => {
        setLoading(true);
        const res = await fetch('/api/question/freetrial/');
        if(!res.ok){
          setLoading(false)
        }else{
          const data = await res.json();
          // Marked choice attribute
          const modifiedData = data.map(question => ({
            ...question,
            choice: -1,
          }))
          // modifiedData[1].choice = 2
          setQuestions(modifiedData);
          setLoading(false);
        }
      }
      fetchQuestions();
    } catch (error) {
      setLoading(false)
      console.log("Error fetching free trial");
    }
  }, [])

  useEffect(() => { // calculate marks got from the quizz
    const getMarks = () => {
      const marks = questions.reduce((acc, question) => {
        if(question.choice === question.correctAnswer){
          return acc + 1
        }
        return acc
      }, 0)
      return marks
    }
    const marks = getMarks() / questions.length * 100;
    setMarks(marks.toFixed(0))
  }, [completed])

  const handleAnswers = (qNo, selectedIndex) => { //update state with selected answers
    const updatedQuestions = questions.map((question, index) => {
      if (index === qNo) {
        if(selectedIndex == question.choice){
          return { ...question, choice: -1 }
        }
        return { ...question, choice: selectedIndex };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const handleSubmit = () => {
    setCompleted(true);
  }

  if(completed){ // page after submitting answers
    return (
      <div>
        <div className="bg-mid-blue p-8 text-sm font-semibold">
        <h3 className="text-white text-2xl pl-[14vw]">Your Score : {marks}%</h3>
        <p className="text-white opacity-50 pl-[14vw]">completed</p>
      </div>
      <div className="mt-10 flex flex-col justify-center items-center gap-12">
        {questions.map((question, index) => {
          return (
            <>
            <div key={index} className="max-w-6xl w-full py-8 px-12 text-sm rounded-3xl drop-shadow-md bg-light-blue">
              <p className="p-2">{index + 1}. {question.content}</p>
              <div>
                {question.options.map((option, index) => (
                  <div className="ml-10 p-1" key={index}>
                    <Radio
                      id={`op${index}`}
                      readOnly
                      checked={index == question.choice}
                      className={`${index === question.choice ? ( question.choice === question.correctAnswer ? 'text-green-500' : 'text-red-500'  ) : 'bg-light-blue' }`}
                    />
                    <Label 
                      htmlFor={`op${index}`} 
                      className={`px-2 ${index === question.choice ? ( question.choice === question.correctAnswer ? 'text-green-500' : 'text-red-500'  ) : 'bg-light-blue' }`}>
                        {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            {question.choice === question.correctAnswer && (
              <Alert color="success" className="w-full max-w-6xl mt-[-25px] drop-shadow-md">
                <div className="flex flex-row">
                  <FaCheck className="mr-2 mt-[3px]" />
                  <p>Correct Answer</p>
                </div>
              </Alert>
            )}
            {question.choice !== question.correctAnswer &&  (
              <div className="w-full max-w-6xl">
                <Alert color="failure" className="mt-[-30px] drop-shadow-md flex flex-row">
                  <div className="flex flex-row">
                    <FaTimes className="mr-2 mt-[3px]" />
                    <p>Incorrect Answer</p>                
                  </div>
                </Alert>
                <Alert className="bg-[#e6ddda] mt-4 w-full max-w-6xl drop-shadow-md flex flex-row">
                  <div className="flex flex-row w-full justify-between max-w-6xl">
                    <div className="flex - flex-row">
                      <HiOutlinePencil className="mt-[2px] mr-2"/>
                      Answer : {question.options[question.correctAnswer]} 
                    </div>
                    {/* <button className=""> show reason </button>    */}
                  </div>
                  <p className="flex flex-row max-w-6xl w-[70vw]">
                    <HiOutlinePencilAlt className="mt-[2px] mr-2"/>
                    <div className="">
                      Justification : {question.justification}
                    </div>
                  </p>
                </Alert>
              </div>
            )}
            </>  
          )
        })}
      </div>    
      </div>
    
    )
  }

  return ( // page before submitting answers
    <div className="min-h-screen">
      <div className="bg-mid-blue p-8 text-sm font-semibold">
        <h3 className="text-white">This free trial contains 10 questions.   Each question has 5 choices as answers.</h3>
        <p className="text-white opacity-50">Time duration - 30minutes</p>
      </div>
      <main className="flex flex-col gap-10 p-10 max-w-6xl mx-auto">
        <div className="flex justify-between w-full font-semibold">
          <span className="flex items-center gap-2 px-8 py-2 w-fit rounded-full bg-mid-blue text-white">
            <AiFillClockCircle />
            <p className="text-nowrap">28 min 43 sec</p>
          </span>
          {!loading &&
            <div className="w-full flex justify-end">
              {questions.length > 0 && questions.map((question, index) => (
                <div className="flex items-center" key={index}>
                  <button  
                    onClick={() => setQuestionNo(index)}
                    className={`w-10 h-10 rounded-full ${question.choice > -1 ? 'bg-mid-blue text-white' : 'bg-light-blue' } transition-all`}>
                      {index + 1}
                  </button>
                  <div className={`h-2 w-12 mx-[-4px] ${question.choice > -1 ? 'bg-mid-blue text-white' : 'bg-light-blue' } transition-all`}></div>
                </div>
              ))}
            </div>
          }
        </div>
        {!loading && questions.length > 0 ? (
          <div id="questions" className="py-8 px-12 text-sm rounded-3xl drop-shadow-md bg-light-blue">
            <p className="p-2">{questionNo + 1}. {questions[questionNo].content}</p>
            <div>
              {questions[questionNo].options.map((option, index) => (
                <div className="ml-10 p-1" key={index}>
                  <Radio
                    id={`op${index}`}
                    readOnly
                    checked={index == questions[questionNo].choice}
                    onClick={() => handleAnswers(questionNo, index)}
                  />
                  <Label htmlFor={`op${index}`} className="px-2">{option}</Label>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-12 h-12">
            <Spinner className="text-blue-500"/>
          </div>
        )}
        {questionNo <= questions.length - 2 ? (
          <Button
            className="self-end pl-4 bg-mid-blue"
            pill
            onClick={() => setQuestionNo(questionNo + 1)}
          >
            <span className="flex flex-row items-center gap-3">
              Next Question
              <HiChevronRight className="w-6 h-6" />
            </span>
          </Button>
        ) : (
          (questionNo == questions.length - 1 ) && (
          <Button
            className="self-end px-4 bg-mid-blue"
            pill
            onClick={() => handleSubmit()}
          >
            <span className="flex flex-row items-center gap-3">
              Submit Answers
            </span>
          </Button>
          )
        )}
      </main>
    </div>
  )
}
