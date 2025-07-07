import {
  Alert,
  Button,
  Label,
  Radio,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateQuestion() {
  const [formData, setFormData] = useState({
    options: ['', '', '', '', ''],
    bank: '',
    content: '',
    correctAnswer: '',
    justification: '',
    isActive: '',
  });
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const { questionID } = useParams(); // Assuming you're passing question ID via URL params

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const res = await fetch(`/api/question/getquestion/${questionID}`);
        const data = await res.json(); 
        console.log(data);

        if (res.ok) {
          setFormData({
            options: data.options || ['', '', '', '', ''],
            bank: data.bank || '',
            content: data.content || '',
            correctAnswer: data.correctAnswer || '',
            justification: data.justification || '',
          });
        } else {
          setPublishError(data.message);
        }
      } catch (error) {
        setPublishError("Failed to fetch question data.");
      }
    };

    if (questionID) {
      fetchQuestionData();
    }
  }, [questionID]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...formData.options];
    updatedAnswers[index] = value;
    setFormData({ ...formData, options: updatedAnswers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const res = await fetch(`/api/question/editquestion/${questionID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/question/${questionID}`); // Navigate to another page if needed
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  // Function to auto expand textarea
  const autoExpand = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto'; // Reset height to auto
    textarea.style.height = textarea.scrollHeight + 'px'; // Set height based on scroll height
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <div className="flex flex-row ">
      <Button
            className="my-auto text-black  border-gray-400 bg-gray-100 border-2 "
            onClick={() => {
              navigate(`/dashboard?tab=qaMan`);
            }}
            
          >
           {`<`} 
          </Button>
          <div className="flex justify-center items-center mx-auto">
          <h1 className="text-center text-3xl my-7 font-semibold">Edit Question</h1>

          </div>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mb-5 justify-between">
          <div className="flex-1 mb-5">
            <div className="flex flex-col gap-3">
              <div className="flex flex-row justify-between gap-4">
                <Select
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                  required
                  className="w-full text-gray-600"
                >
                  <option value="">Select Bank</option>
                  <option value="1">Bank 1 - Operating systems</option>
                  <option value="2">Bank 2 - Data Structures and Algorithms</option>
                  <option value="3">Bank 3 - Functional Programming</option>
                  <option value="4">Bank 4 - Computer Networks</option>
                  <option value="5">Bank 5 - Game development</option>
                  <option value="6">Bank 6 - CTF</option>
                </Select>
                <Select 
                  color={formData.isActive === 'true' ? 'success' : 'failure'}
                  className='w-36'
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
                  value={formData.isActive}
                >
                  <option value="true">Active</option>
                  <option value="false">Disabled</option>
                </Select>
              </div>
              <div className="flex flex-col gap-3 mt-2">
                <Label htmlFor="question" value="Add The Content Of the Question" />
                <Textarea
                  id="question"
                  placeholder="Type Here"
                  required
                  rows="6"
                  value={formData.content}
                  className="w-full overflow-hidden text-gray-600"
                  onInput={autoExpand}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  style={{ resize: 'none' }}
                />
              </div>
            </div>
          </div>

          {[1, 2, 3, 4, 5].map((num) => (
            <div className="flex-1" key={num}>
              <div className="mb-2 flex mx-3 justify-between">
                <Label htmlFor={`ans${num}`} value={`Answer ${num}`} />
                {num === 1 && <Label htmlFor="ans" value="Correct Answer" />}
              </div>
              <div className="flex flex-row w-full justify-between">
                <Textarea
                  id={`ans${num}`}
                  placeholder="Type Here"
                  required
                  className="w-full overflow-hidden text-gray-600"
                  rows="1"
                  value={formData.options[num - 1] || ''}
                  onInput={autoExpand}
                  onChange={(e) => handleAnswerChange(num - 1, e.target.value)}
                  style={{ resize: 'none' }}
                />
                <Radio
                  id={`correct-ans${num}`}
                  name="correct-ans"
                  value={num}
                  checked={Number(formData.correctAnswer) === num}
                  className="m-3 mx-12 text-green-500 focus:ring-green-400"
                  onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                />
              </div>
            </div>
          ))}

          <div className="mt-5">
            <Label htmlFor="justification" value="Add The Justification" />
            <Textarea
              id="justification"
              placeholder="Type Here"
              required
              rows="6"
              className="mt-3 w-full overflow-hidden text-gray-600"
              value={formData.justification}
              onInput={autoExpand}
              onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
              style={{ resize: 'none' }}
            />
          </div>
        </div>

        <Button type="submit" className="bg-mid-blue">Update</Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
