import {
  Alert,
  Button,
  FileInput,
  FloatingLabel,
  Label,
  Radio,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

export default function CreateQuestion() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/question/create", {
        method: "POST",
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
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Create a Question
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mb-5  justify-between">
          {/* <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          /> */}
          <div className=" flex-1 mb-5">
            <div className="mb-2 block">
              <Label
                htmlFor="question"
                value="Add The Content Of the Question"
              />
            </div>
            <Textarea id="question" placeholder="Type Here" required rows="6" className="" />
          </div>
            
          <div className="flex-1">
            <div className="mb-2 flex justify-between">
              <Label htmlFor="ans1" value="Add Answer 1" />
              <Label htmlFor="ans" value="Correct Answer" className=""/>
            </div>
            <div className="flex flex-row ">

            <Textarea id="ans1" placeholder="Type Here" required rows="1" />
            <Radio id="correct-ans1" name="correct-ans" value="1" defaultChecked className="m-3 mx-12 text-green-500 focus:ring-green-400"/>
            
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-2 block">
              <Label htmlFor="ans2" value="Add Answer 2" />
            </div>
            <div className="flex flex-row ">

            <Textarea id="ans2" placeholder="Type Here" required rows="1" />
            <Radio id="correct-ans2" name="correct-ans" value="2" className="m-3 mx-12 text-green-500 focus:ring-green-400"/>
            
            </div>
            
          </div>
          <div className="flex-1">
            <div className="mb-2 block">
              <Label htmlFor="ans3" value="Add Answer 3" />
            </div>
            <div className="flex flex-row ">

            <Textarea id="ans3" placeholder="Type Here" required rows="1" />
            <Radio id="correct-ans3" name="correct-ans" value="3" className="m-3 mx-12 text-green-500 focus:ring-green-400"/>
            
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-2 block">
              <Label htmlFor="ans4" value="Add Answer 4" />
            </div>
            <div className="flex flex-row ">

            <Textarea id="ans4" placeholder="Type Here" required rows="1" />
            <Radio id="correct-ans4" name="correct-ans" value="4" className="m-3 mx-12 text-green-500 focus:ring-green-400"/>
            
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-2 block">
              <Label htmlFor="ans5" value="Add Answer 5" />
            </div>
            <div className="flex flex-row ">

            <Textarea id="ans5" placeholder="Type Here" required rows="1" />
            <Radio id="correct-ans5" name="correct-ans" value="5" className="m-3 mx-12 text-green-500 focus:ring-green-400"/>
            
            </div>
          </div>
        </div>

        <Button type="submit" className="bg-mid-blue" onClick={handleSubmit}>
          CREATE
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
