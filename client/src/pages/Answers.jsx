import Answer from "../components/AnswerComponent"

export default function Answers({questions, marks, timeTaken}) {
  //console.table(questions)
  return (
    <div>
      <div className="bg-mid-blue p-8 text-sm font-semibold">
        <h3 className="text-white text-2xl pl-[14vw]">Your Score : {marks}%</h3>
        <p className="text-white opacity-50 pl-[14vw]">{marks/questions.length*100} / {questions.length}</p>
        <p className="text-white opacity-50 pl-[14vw]">completed</p>
        <p className="text-white opacity-50 pl-[14vw]">Time Taken: {timeTaken}</p>

      </div>
      <div className="mt-10 flex flex-col justify-center items-center gap-12">
        {questions.map((question, index) => (
          <Answer key={index} question={question} index={index} />
        ))}
      </div>    
    </div>
  )
}
