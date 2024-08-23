import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Button, Table, TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";

export default function DashQAManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchQuestions = async (searchTerm = "", startIndex = 0, reset = false) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/question/getquestions?searchTerm=${encodeURIComponent(searchTerm)}&startIndex=${startIndex}`
      );
      if (!res.ok) {
        console.log("Error fetching questions:", res.statusText);
        return;
      }
      const data = await res.json();
      if (data.questions.length < 6) {
        setHasMore(false); // No more questions to load if less than limit returned
      }
      setQuestions(prevQuestions => reset ? data.questions : [...prevQuestions, ...data.questions]); // Append or reset questions
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

  return (
    <div className="flex sm:flex-col w-full p-4">
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
        <button className="flex flex-row justify-center items-center min-w-20 p-4 h-11 gap-4 bg-mid-blue rounded-xl">
          <FaPlus className="text-white w-6 h-6" />
          <div className="text-white text-md">Add New Question</div>
        </button>
      </div>
      {loading ? (
        <div className="text-gray-500 mt-4 text-center">Loading...</div>
      ) : (
        <div className="mt-4 flex flex-col">
          {questions.length === 0 ? (
            <div className="text-gray-500 text-center">No questions</div>
          ) : (
            <div className="flex flex-col">
              <Table>
                <Table.Head className="text-center">
                  <Table.HeadCell>Question ID</Table.HeadCell>
                  <Table.HeadCell>Question</Table.HeadCell>
                  <Table.HeadCell>Answers</Table.HeadCell>
                  <Table.HeadCell>Edit</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {questions.map((question, index) => (
                    <Table.Row key={index} className="bg-white">
                      <Table.Cell>{question._id}</Table.Cell>
                      <Table.Cell className="truncate max-w-xs">{question.content}</Table.Cell>
                      <Table.Cell className="truncate max-w-xs">
                        {question.options && question.options.join(", ")}
                      </Table.Cell>
                      <Table.Cell>
                        <Button className="bg-green-600 rounded-xl">Edit</Button>
                      </Table.Cell>
                      <Table.Cell>
                        <Button className="bg-red-800 rounded-xl">Delete</Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
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
