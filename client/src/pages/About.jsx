import {Button } from "flowbite-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="flex items-center min-h-screen bg-white dark:bg-gray-900 text-center">
      <div className="container mx-auto flex flex-col items-center">
        <h1 className="text-[48px] font-bold text-center text-mid-blue dark:text-white mb-5 mt-[-130px]">
          About Us
        </h1>

        <div className="flex flex-col gap-8 items-center">
          <div className="w-full max-w-[40rem] ">
      
              <h2 className="text-[21px] font-semibold text-dark-blue dark:text-white mb-2 ">
                Welcome to ExamEase !
              </h2>
              <p className="text-dark-blue' dark:text-gray-300 text-[16px] ">
                At ExamEase, we believe in the power of education and the importance of continuous learning. We provide a seamless and secure way for students and professionals to take exams from any location of their choice.
              </p>
      
          </div>

          <div className="w-full max-w-[40rem]"> 

              <h2 className="text-[21px] font-semibold text-dark-blue dark:text-white mb-2 ">
                Our Mission
              </h2>
              <p className="text-dark-blue dark:text-gray-300 text-[16px] ">
                Our mission is to make high-quality, accessible, and reliable examination experiences available to everyone. We aim to remove the barriers to education and professional development by offering an innovative, user-friendly platform.
              </p>
    
            </div>

            <div className="w-full max-w-[40rem]"> 

              <h2 className="text-[21px] font-semibold text-dark-blue dark:text-white mb-2 ">
                 Join Us Today !
              </h2>
              <p className="text-dark-blue dark:text-gray-300 text-[16px] ">
              Whether you're a student preparing for an academic exam or a professional aiming for a certification, ExamEase is here to support you every step of the way. Join us today and take your learning journey to the next level!
              </p>

</div>
        

        </div>

        <div className="text-center mt-10">
          <Button className="bg-mid-blue hover:bg-dark-blue " pill>
          <Link to={"/signin"} state={{ from: "/freetrial" }}>
              Start free trial
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
