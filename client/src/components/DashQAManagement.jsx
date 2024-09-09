import React, { useEffect, useState } from "react";
import { FaPlus, FaRegEdit, FaTrash } from "react-icons/fa";
import { Button, Table, TextInput, Modal } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashQAManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [modalFunction, setModalFunction] = useState(null);
  // const [questionID,setQuestionID] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [questionIdToDelete, setQuestionIdToDelete] = useState(null);
  const [questionIdToActive, setQuestionIdToActive] = useState(null);
  
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchQuestions = async (
    searchTerm = "",
    startIndex = 0,
    reset = false
  ) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/question/getquestions?searchTerm=${searchTerm}&startIndex=${startIndex}`
      );
      if (!res.ok) {
        console.log("Error fetching questions:", res.statusText);
        return;
      }
      const data = await res.json();
      if (data.questions.length < 6) {
        setHasMore(false); // No more questions to load if less than limit returned
      }
      setQuestions((prevQuestions) =>
        reset ? data.questions : [...prevQuestions, ...data.questions]
      ); // Append or reset questions
    } catch (error) {
      console.log("Error fetching questions:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setStartIndex(0); // Reset startIndex on a new search
    setHasMore(true); // Reset hasMore on a new search
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/dashboard?${urlParams.toString()}`);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTermFromURL = searchParams.get("searchTerm") || "";
    setSearchTerm(searchTermFromURL); // Sync the state with the URL
    fetchQuestions(searchTermFromURL, 0, true); // Fetch with reset on initial load or search
  }, [location.search]);

  const loadMoreQuestions = () => {
    const newIndex = startIndex + 6;
    setStartIndex(newIndex);
    fetchQuestions(searchTerm, newIndex);
  };

  const handleDeleteQuestion = async (questionID) => {
    //setShowModal(false);
    try {
      const res = await fetch(`/api/question/deletequestion/${questionID}`, {
        method: "DELETE",
      });
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
  };
  const handleActiveQuestion = async (question) => {
    try {
      const res = await fetch(`/api/question/activequestion/${question._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        const data = await res.json();
        console.log(data.message);
        return;
      }
  
      // Update the local questions state immediately after a successful API call
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q._id === question._id ? { ...q, isActive: !q.isActive } : q
        )
      );
    } catch (error) {
      console.log("Something went wrong", error.message);
    }
  };
  
  

  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex flex-col gap-4 w-full h-12 md:flex-row md:items-center md:justify-between">
        <form onSubmit={handleSearch} className="md:flex-1 md:mr-4">
          <TextInput
            type="text"
            placeholder="Search ..."
            rightIcon={AiOutlineSearch}
            value={searchTerm}
            className="w-full"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <button
          className="flex flex-row justify-center items-center min-w-20 p-4 h-11 gap-4 bg-mid-blue rounded-xl "
          onClick={() => navigate("/createQuestion")}
        >
          <FaPlus className="text-white w-6 h-6" />
          <div className="text-white text-md">Add New Question</div>
        </button>
      </div>
      {loading ? (
        <div className="text-gray-500 mt-20 lg:mt-4 text-center">Loading...</div>
      ) : (
        <div className="lg:mt-4 flex mt-16 flex-col">
          {questions.length === 0 ? (
            <div className="text-gray-500 text-center">No questions</div>
          ) : (
            <div className="flex flex-col">
              <Table>
                <Table.Head className="">
                  <Table.HeadCell>Bank</Table.HeadCell>
                  <Table.HeadCell className="truncate lg:max-w-xs max-w-2">Question</Table.HeadCell>
                  <Table.HeadCell className="hidden lg:block">Correct Answers</Table.HeadCell>
                  <Table.HeadCell>Active</Table.HeadCell>
                  <Table.HeadCell>Edit</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {questions.map((question, index) => (
                    <Table.Row key={index} className="bg-white">
                      <Table.Cell>{question.bank}</Table.Cell>
                      <Table.Cell className="truncate lg:max-w-xs max-w-2" >
                        <Link to = {`/question/${question._id}`}>
                          {question.content}
                        </Link>
                      </Table.Cell>
                      <Table.Cell className="truncate max-w-xs hidden lg:block">
                        {question.options &&
                          question.options[question.correctAnswer]}
                      </Table.Cell>
                      <Table.Cell className="max-w-xs" >
                        <Button onClick={() => {setModalFunction('ACTIVE');setQuestionIdToActive(question);setShowModel(true);}}>
                          {question.isActive ? (
                            <FaCheck className="text-green-500"/>
                          ) : (
                            <FaTimes className="text-red-600" />
                          )}
                        </Button>
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          className="bg-blue-600 rounded-xl"
                          onClick={() => handleEditQuestion(question._id)}
                        >
                          <FaRegEdit />
                        </Button>
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          className="bg-red-800 rounded-xl"
                          onClick={() => {
                            setModalFunction('DELETE')
                            setShowModel(true);
                            setQuestionIdToDelete(question._id);
                          }}
                        >
                          <FaTrash />
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>

              <Modal
                show={showModel}
                onClose={() => setShowModel(false)}
                popup
                size="md"
              >
                <Modal.Header />
                <Modal.Body>
                  <div className="text-center">
                    <HiOutlineExclamationCircle
                      className="h-14 w-14 text-gray-400 dark:text-gray-200 
               mb-4 mx-auto"
                    />
                    {modalFunction === 'DELETE' &&
                    <>
                    <h3
                      className="mb-5 text-lg text-gray-500
                dark:text-gray-400"
                    >
                      Are you sure you want to delete this question?
                    </h3>
                    <div className="flex justify-center gap-4">
                      <Button
                        color="failure"
                        onClick={() => {
                          handleDeleteQuestion(questionIdToDelete);
                          setShowModel(false);
                        }}
                      >
                        Yes, I'm sure
                      </Button>
                      <Button color="gray" onClick={() => setShowModel(false)}>
                        No, Cancel
                      </Button>
                    </div>
                    </> 
                  }
                  {modalFunction === 'ACTIVE' &&
                    <>
                    {questionIdToActive.isActive ? (
                        <h3
                        className="mb-5 text-lg text-gray-500
                  dark:text-gray-400"
                      >
                        Are you sure you want to deactivate this question?
                      </h3>
                    ):(
                      <h3
                      className="mb-5 text-lg text-gray-500
                dark:text-gray-400"
                    >
                      Are you sure you want to activate this question?
                    </h3>
                    )}
                    
                    <div className="flex justify-center gap-4">
                      <Button
                        color="failure"
                        onClick={() => {
                          handleActiveQuestion(questionIdToActive);
                          setShowModel(false);
                        }}
                      >
                        Yes, I'm sure
                      </Button>
                      <Button color="gray" onClick={() => setShowModel(false)}>
                        No, Cancel
                      </Button>
                    </div>
                    </> 
                  }
                  </div>
                </Modal.Body>
              </Modal>
              {hasMore && (
                <button
                  className="text-center text-s text-mid-blue mt-4"
                  onClick={loadMoreQuestions}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "More"}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
