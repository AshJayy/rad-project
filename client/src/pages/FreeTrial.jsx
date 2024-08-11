import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { AiFillClockCircle } from "react-icons/ai";
import { HiChevronRight } from "react-icons/hi";
import Question from "../components/Question";
import Answers from "./Answers";
import { FcQuestions } from "react-icons/fc";

export default function FreeTrial() {

  const [questions, setQuestions] = useState([]);
  const [questionIdx, setquestionIdx] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [marks, setMarks] = useState(0);

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

  const calculateMarks = () => {
    const totalMarks = questions.reduce((acc, question) => {
      if (question.choice === question.correctAnswer) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return (totalMarks / questions.length) * 100;
  };

  const addExamination = async (marks) => {
    try {
        const res = await fetch('/api/exam/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ questions, marks }),
        });

        if (!res.ok) {
            console.error('Error in adding examination details:', res.status, res.statusText);
            return;
        }

        // Check if the response body is empty before parsing
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;

        if (data) {
            console.log('Examination added successfully:', data);
        } else {
            console.log('No data returned from the server.');
        }
    } catch (error) {
        console.error('An error occurred while adding examination details:', error);
    }
};


  const handleSubmit = async () => {
    setCompleted(true);
    const marks = calculateMarks();
    setMarks(marks.toFixed(0))

    try {
      await addExamination(marks);
    } finally {
      setCompleted(true);
    }
  }

  if(completed){
    return (
      <div>
        <Answers questions={questions} marks={marks} />
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
                <div className="flex items-center" key={index}>
                  <button
                    onClick={() => setquestionIdx(index)}
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
          <Question
            question={questions[questionIdx]}
            questionIdx={questionIdx}
            handleAnswers={handleAnswers}
          />
        ) : (
          <div>
            <Spinner />
          </div>
        )}
        {questionIdx <= questions.length - 2 ? (
          <Button
            className="self-end pl-4 bg-mid-blue"
            pill
            onClick={() => setquestionIdx(questionIdx + 1)}
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
