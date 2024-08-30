import { Alert, Label, Radio } from "flowbite-react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlinePencil, HiOutlinePencilAlt } from "react-icons/hi";

export default function AnswerComponent({ question, index }) {
  return (
    <>
      <div className='max-w-6xl w-full py-8 px-12 text-sm rounded-3xl drop-shadow-md bg-light-blue'>
        <p className='p-2'>
          {index + 1}. {question.content}
        </p>
        <div>
          {question.options.map((option, index) => (
            <div
              className='ml-10 p-1'
              key={index}
            >
              <Radio
                id={`op${index}`}
                readOnly
                checked={index === question.choice}
                defaultValue={index == question.choice}
                className={`${
                  index === question.choice
                    ? question.choice === question.correctAnswer
                      ? "text-green-500"
                      : "text-red-500"
                    : "bg-light-blue"
                }`}
              />
              <Label
                htmlFor={`op${index}`}
                className={`px-2 ${
                  index === question.choice
                    ? question.choice === question.correctAnswer
                      ? "text-green-500"
                      : "text-red-500"
                    : "bg-light-blue"
                }`}
              >
                {option}
              </Label>
            </div>
          ))}
        </div>
      </div>
      {question.choice === question.correctAnswer && (
        <Alert
          color='success'
          className='w-full max-w-6xl mt-[-25px] drop-shadow-md'
        >
          <div className='flex ml-4 flex-row'>
            <FaCheck className='mr-2 mt-[3px]' />
            <p>Correct Answer</p>
          </div>
        </Alert>
      )}
      {question.choice !== question.correctAnswer && (
        <div className='w-full max-w-6xl'>
          <Alert
            color='failure'
            className='mt-[-30px] drop-shadow-md flex flex-row'
          >
            <div className='flex ml-4 flex-row'>
              <FaTimes className='mr-2 mt-[3px]' />
              <p>Incorrect Answer</p>
            </div>
          </Alert>
          <Alert className='bg-[#e6ddda] mt-4 w-full max-w-6xl drop-shadow-md flex flex-row'>
            <div className='flex flex-row w-full justify-between max-w-6xl'>
              <div className='flex ml-4 flex-row'>
                <HiOutlinePencil className='mt-[2px] mr-2' />
                Answer : {question.options[question.correctAnswer]}
              </div>
              {/* <button className=""> show reason </button>    */}
            </div>
            {question.justification.length > 0 && (
              <div className='flex ml-4 flex-row max-w-6xl w-[70vw]'>
                <HiOutlinePencilAlt className='mt-[2px] mr-2' />
                <p className=''>Justification : {question.justification}</p>
              </div>
            )}
          </Alert>
        </div>
      )}
    </>
  );
}
