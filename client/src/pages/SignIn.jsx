import React, { useState } from 'react';
import { Button,Label, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      dispatch(signInStart());
      
      if(res.ok){
          dispatch(signInSuccess(data));
          navigate('/');
        } else {
        console.log('Sign-in failed');
        dispatch(signInFailure());
      }
    } catch (error) {
      console.error('Error:', error);
      dispatch(signInFailure());
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center items-center p-10">
        <h1 className="text-xl font-bold mb-4">LOG IN</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <Label htmlFor="email" value="Email" />
            <TextInput
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              required
              className="w-full"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password" value="Password" />
            <TextInput
              id="password"
              type="password"
              placeholder="**********"
              value={password}
              required
              className="w-full"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full bg-mid-blue"  >
            sign In
          </Button>
          <OAuth/>
        </form>
        <div className="flex gap-2 text-sm mt-5">
          <span>Don't have an account?</span>
          <Link to="/signup" className="text-blue-500">Sign Up</Link>
        </div>
      </div>
      <div className="flex-1 hidden md:flex justify-center items-center bg-mid-blue rounded-lg pd-100 relative">
        <div className="w-full h-full bg-cover bg-center rounded-lg relative">
          <img
              src="https://img.freepik.com/free-vector/digital-designers-team-drawing-with-pen-computer-monitor_74855-10586.jpg"
              alt="Small Image"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
