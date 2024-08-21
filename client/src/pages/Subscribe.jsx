import { Button } from 'flowbite-react'
import React,{ useEffect, useState, } from 'react'
import { useSelector } from 'react-redux'
import { FaCheck, } from 'react-icons/fa';
import { IoDocumentTextOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'; 


export default function Subscribe() {
  const { currentUser } = useSelector(state => state.user);
  const [subType, setSubType] = useState(null);
  const Items = [
    {
      type:1,
      name:'Weekly plan',
      price: "500",
      benefits: [
        'benefits 1',
        'benefits 2',
        'benefits 3',
        'benefits 4'
      ]
    },{
      type:2,
      name:'Monthly plan',
      price: "1500",
      benefits: [
        'benefits 1',
        'benefits 2',
        'benefits 3',
        'benefits 4'
      ]
    },{
      type:3,
      name:'Annual plan',
      price: "10000",
      benefits: [
        'benefits 1',
        'benefits 2',
        'benefits 3',
        'benefits 4'
      ]
    }
  ];
  const navigate = useNavigate();
  console.log(subType)
  // useEffect(() => {
  //   const getsubs = async () => {
  //     const res = await fetch('/api/sub/makepayment', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         userId : currentUser._id,        
  //         type: '1',
  //       }),
  //     });
  //     const data = await res.json();
  //     if(!res.ok) {
  //       console.log(res.error)
  //     }
  //     if(res.ok) {
  //       console.log(data)
  //       // navigate(`/home`);
  //     }
  //   }
  //   try {
  //     getsubs();
  // } catch (error) {
  //     console.log(error);
  // }
  // },[])
  return (
    <div className="">
      {!subType ? (
        <div className="min-h-screen flex flex-col items-center">
        <h1 className="text-5xl text-center font-bold mt-9">Pick your <span className='text-blue-800'>perfect</span> plan</h1>
        <h1 className="text-2xl font-bold mt-5">14 days free trial</h1>
        <h1 className="text-1xl text-center text-gray-400 ">Get the right plan for you. Plans can be upgraded in the future.</h1>
        <div className="flex flex-col mb-10 mt-[-18px] sm:my-6 mx-10 md:flex-row justify-center items-center w-[95%]  gap-5 ">
          {Items.map((item) => (
            <div
              key={item.type}
              className="flex flex-col flex-1 p-3 shadow-[3px_5px_5px_1px_rgba(0,0,0,0.2)] w-[350px] h-[450px] mt-10 sm:mt-6 border-solid gap-4 border-[1px] rounded-[30px] border-gray-400 justify-between items-center hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <h1 className='text-[20px] mt-3 font-bold'>{item.name}</h1>
              <h1 className=' font-bold text-5xl'>{item.price}LKR</h1>
              <ul className=''>
                {item.benefits.map((benefit) => (
                  <li className="flex flex-row  gap-3 mt-2" key={benefit}><FaCheck className='text-blue-800 mt-1 mr-3 '/>{benefit}</li>
                ))}
              </ul>
              <button
                onClick={() => {
                  setSubType(item);
                }}
                className="w-[23vh] mb-3 hover:bg-blue-800 hover:text-white border-solid font-semibold text-blue-800 border-2 p-2 rounded-[20px] border-blue-800 "
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
      ):(
        <div>
          <div className="flex gap-16 flex-col min-h-screen justify-center items-center">
            <h1 className='text-5xl sm:mt-[-10vh] font-bold text-center'>Choose your <span className='text-blue-800'> payment </span> method.</h1>
            <div className="flex flex-col w-full gap-8 justify-center items-center">
              <div 
                onClick={() => {
                  navigate(`/makepayment?type=${subType.type}`);}} 
                className="hover:scale-110 flex p-3 flex-row text-center justify-center border-solid border-[1px] rounded-[30px] border-gray-400  h-48 w-3/4 sm:w-1/2 shadow-[3px_5px_5px_1px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-in-out">
                <div className="flex  w-1/2 flex-col justify-center items-center">
                  <h1 className='text-[3.5vh] font-bold'>Card Payment</h1>
                  <h1 className='text-gray-400'>Pay with your credit card</h1>  
                </div>
                <div 
                  className="w-1/2 flex justify-center items-center">
                  <div className="border-solid  border-[1px] rounded-[10px] border-blue-800 bg-blue-800 sm:w-[30vh] w-[21vh] sm:h-full h-[15vh]">
                    <div className="bg-gray-700 h-6 mt-8"></div>
                    <div className="flex flex-row">
                      <div className="bg-white h-2 m-2 w-2/4 mt-3"></div>
                      <div className="bg-white h-2 m-2 w-1/4 mt-3"></div>
                    </div>
                    <div className="bg-white h-2 m-2 w-1/4 mt-8"></div>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => {
                  navigate(`/maketranfer?type=${subType.type}`);}} 
                className="hover:scale-110 flex p-3 flex-row  justify-center border-solid border-[1px] rounded-[30px] border-gray-400  h-48 w-3/4 sm:w-1/2 shadow-[3px_5px_5px_1px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-in-out">
                <div className="flex w-1/2 flex-col justify-center items-center">
                  <h1 className='text-[3.5vh] text-center font-bold'>Bank Tranfer</h1>
                  <h1 className='text-gray-400 text-center'>Make a bank tranfer and subscribe</h1>  
                </div>
                <div className="w-1/2">
                  <IoDocumentTextOutline className='h-full w-full' />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
