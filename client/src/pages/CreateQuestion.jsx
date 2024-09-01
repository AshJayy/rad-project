import {
   Alert,
   Button,
   Label,
   Radio,
   Select,
   Textarea,
   TextInput,
 } from "flowbite-react";
 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 
 export default function CreateQuestion() {
   const [formData, setFormData] = useState({
     options: [],
     bank: '',
     content: '',
     correctAnswer: '',
     justification: '',
   });
   const [publishError, setPublishError] = useState(null);
   const navigate = useNavigate();
 
   const handleAnswerChange = (index, value) => {
     const updatedAnswers = [...formData.options];
     updatedAnswers[index] = value;
     setFormData({ ...formData, options: updatedAnswers });
   };
 
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
         console.log(formData);
         return;
       }
 
       if (res.ok) {
         setPublishError(null);
         navigate('/'); // Navigate to another page if needed
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
       <h1 className="text-center text-3xl my-7 font-semibold">
         Create a Question
       </h1>
       <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
         <div className="flex flex-col gap-4 mb-5 justify-between">
           <div className="flex-1 mb-5">
             <div className="flex flex-col gap-4">
               <Select
                 onChange={(e) =>
                   setFormData({ ...formData, bank: e.target.value })
                 }
                 required
               >
                 <option value="">Select Bank</option>
                 <option value="1">Bank 1 - Operating systems</option>
                 <option value="2">Bank 2 - Data Structures and Algorithms</option>
                 <option value="3">Bank 3 - Functional Programming</option>
                 <option value="4">Bank 4 - Computer Networks</option>
                 <option value="5">Bank 5 - Game development</option>
                 <option value="6">Bank 6 - CTF</option>
               </Select>
               <div className="flex flex-col gap-3 mt-2">
                 <Label htmlFor="question" value="Add The Content Of the Question" />
                 <Textarea
                   id="question"
                   placeholder="Type Here"
                   required
                   rows="6" // Start with six rows
                   className="w-full overflow-hidden"
                   onInput={autoExpand} // Auto-expand functionality
                   onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                   style={{ resize: 'none' }} // Prevent manual resizing
                 />
               </div>
             </div>
           </div>
 
           {[1, 2, 3, 4, 5].map((num) => (
             <div className="flex-1" key={num}>
               <div className="mb-2 flex justify-between">
                 <Label htmlFor={`ans${num}`} value={`Add Answer ${num}`} />
                 {num === 1 && (
                   <Label htmlFor="ans" value="Correct Answer" className="" />
                 )}
               </div>
               <div className="flex flex-row w-full justify-between">
                 <Textarea
                   id={`ans${num}`}
                   placeholder="Type Here"
                   required
                   className="w-full overflow-hidden"
                   rows = "1"
                   onInput={autoExpand} // Auto-expand functionality
                   onChange={(e) => handleAnswerChange(num - 1, e.target.value)}
                   style={{ resize: 'none' }} // Prevent manual resizing
                 />
                 <Radio
                   id={`correct-ans${num}`}
                   name="correct-ans"
                   value={num}
                   className="m-3 mx-12 text-green-500 focus:ring-green-400"
                   onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                 />
               </div>
             </div>
           ))}
 
           <div className="mt-5">
             <Label htmlFor="justification" value="Add The justification" />
             <Textarea
               id="justification"
               placeholder="Type Here"
               required
               rows="6" // Start with six rows
               className="mt-3 w-full overflow-hidden"
               onInput={autoExpand} // Auto-expand functionality
               onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
               style={{ resize: 'none' }} // Prevent manual resizing
             />
           </div>
         </div>
 
         <Button type="submit" className="bg-mid-blue">
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
 