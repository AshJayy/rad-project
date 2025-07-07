import React, { useState } from 'react';
import { Alert, Button,Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn () {
  const [formData, setFormData] = useState({});
  const {loading, error: errorMessage} = useSelector(state => state.user);
  const location = useLocation(); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.id]: e.target.value.trim() }); 
    }
    
    const handleSubmit =  async (e) => {    
      e.preventDefault();  
      if( !formData.email || !formData.password){
        return dispatch(signInFailure('Please fill all the fields'));
      }
      try {
        dispatch(signInStart());
        const res = await fetch('/api/auth/signin', {
          method : 'POST',
          headers : {'Content-Type': 'application/json'},
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          
          return dispatch(signInFailure(data.message));
        }
        
        if(res.ok){
          dispatch(signInSuccess(data));
          navigate('/');
        }
      } catch (error) {
        dispatch(signInFailure(error.message));
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
              required
              className="w-full"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password" value="Password" />
            <TextInput
              id="password"
              type="password"
              placeholder="**********"
              required
              className="w-full"
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="w-full bg-mid-blue"  disabled={loading}>
          {
                loading ? (
                  <>
                  <Spinner className='sm'/>
                  <span className='pl-3'>Loading...</span>
                  </>

                ) : ('Sign In')
              }
          </Button>
          <OAuth/>
        </form>
        <div className="flex gap-2 text-sm mt-5">
          <span>Don't have an account?</span>
          <Link to="/signup" className="text-blue-500">Sign Up</Link>
          
        </div>
        {errorMessage && (
          <Alert className='mt-5 max-w-md w-full' color='failure'>
            {errorMessage}
          </Alert>
        )}
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

