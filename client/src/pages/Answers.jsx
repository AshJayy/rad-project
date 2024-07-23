import Answer from "../components/Answer"

export default function Answers({questions, marks}) {
  return (
    <div>
        <div className="bg-mid-blue p-8 text-sm font-semibold">
        <h3 className="text-white text-2xl pl-[14vw]">Your Score : {marks}%</h3>
        <p className="text-white opacity-50 pl-[14vw]">completed</p>
      </div>
      <div className="mt-10 flex flex-col justify-center items-center gap-12">
        {questions.map((question, index) => (
          <Answer key={index} question={question} index={index} />
        ))}
      </div>    
      </div>
  )
}
