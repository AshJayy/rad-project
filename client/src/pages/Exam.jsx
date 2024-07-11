import { Button, Label, List, Radio, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { AiFillClockCircle } from "react-icons/ai";
import { HiChevronRight } from "react-icons/hi";

export default function Exam() {
  const [questions, setQuestions] = useState([]);
  const [questionNo, setQuestionNo] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
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

  const handleAnswers = (qNo, selectedIndex) => {
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

  if(completed){
    return (
      <div>
        completed
      </div>
    )
  }

  return (
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
                <div className="flex items-center">
                  <button 
                    key={index} 
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
                <div className="ml-10 p-1">
                  <Radio
                    id={`op${index}`}
                    key={index}
                    checked={index == questions[questionNo].choice}
                    onClick={() => handleAnswers(questionNo, index)}
                  />
                  <Label htmlFor={`op${index}`} className="px-2">{option}</Label>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <Spinner />
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
          <Button
            className="self-end px-4 bg-mid-blue"
            pill
            onClick={() => handleSubmit()}
          >
            <span className="flex flex-row items-center gap-3">
              Submit Answers
            </span>
          </Button>
        )}
      </main>
    </div>
  )
}
