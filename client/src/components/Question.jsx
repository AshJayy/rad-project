import { Radio, Label } from "flowbite-react";

export default function Question({ question, questionIdx, handleAnswers }) {
  return (
    <div
      id='question'
      className='py-8 px-12 text-sm rounded-3xl drop-shadow-md bg-light-blue'
    >
      <p className='p-2'>
        {questionIdx + 1}. {question.content}
      </p>
      <div>
        {question.options.map((option, index) => (
          <div
            className='ml-10 p-1'
            key={index}
          >
            <Radio
              id={`op${questionIdx}-${index}`}// make sure that answer for questions are unique
              checked={index == question.choice}
              onChange={() => handleAnswers(questionIdx, index)}
            />
            <Label
              htmlFor={`op${questionIdx}-${index}`}
              className='px-2'
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
