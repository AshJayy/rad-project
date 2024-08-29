import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Button, Table, TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function DashQAManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  // const [questionID,setQuestionID] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/dashboard?${searchQuery}`);
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/question/getQuestions/');
        if (!res.ok) {
           console.log("Error fetching questions:", res.statusText);
        }
        const data = await res.json();
        setQuestions(data.posts || []);
      } catch (error) {
        console.log("Error fetching questions:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleDeleteQuestion = async (questionID) => {
    //setShowModal(false);
    try {
      const res = await fetch(
        `/api/question/deletequestion/${questionID}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setQuestions((prev) =>
          prev.filter((question) => question._id !== questionID)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEditQuestion = (questionID) => {
    navigate(`/editQuestion/${questionID}`);
  }

  return (
    <div className='flex sm:flex-col w-full p-4'>
      <div className='flex flex-col gap-4 w-full h-12 md:flex-row md:items-center md:justify-between'>
        <form onSubmit={handleSearch} className='md:flex-1 md:mr-4'>
          <TextInput
            type='text'
            placeholder='Search ...'
            rightIcon={AiOutlineSearch}
            value={searchTerm}
            className='w-full'
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <button className='flex flex-row justify-center items-center min-w-20 p-4 h-11 gap-4 bg-mid-blue rounded-xl ' 
        onClick={() => navigate('/createQuestion')}>
          <FaPlus className='text-white w-6 h-6' />
          <div className='text-white text-md'>Add New Question</div>
        </button>
      </div>
      {loading ? (
        <div className="text-gray-500 mt-4 text-center">Loading...</div>
      ) : (
        <div className="mt-4 flex flex-col">
          {questions.length === 0 ? (
            <div className="text-gray-500 text-center">No questions</div>
          ) : (
            <div>
              <Table>
                <Table.Head className="text-center">
                  <Table.HeadCell>Question ID</Table.HeadCell>
                  <Table.HeadCell>Question</Table.HeadCell>
                  <Table.HeadCell>Answers</Table.HeadCell>
                  <Table.HeadCell>Edit</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {questions.map((question) => (
                    <Table.Row key={question._id} className="bg-white">
                      <Table.Cell className="">{question._id}</Table.Cell>
                      <Table.Cell className="">{question.content}</Table.Cell>
                      <Table.Cell className="truncate max-w-48">
                        {question.options && question.options.join(', ')}
                      </Table.Cell>
                      <Table.Cell>
                        <Button className="bg-green-600 rounded-xl"
                        onClick={() => handleEditQuestion(question._id)}>Edit</Button>
                      </Table.Cell>
                      <Table.Cell>
                        <Button className="bg-red-800 rounded-xl"
                        onClick={() => handleDeleteQuestion(question._id)}>Delete</Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
