import React, { useState } from 'react';
import { Alert, Button,Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import Logo from '../components/Logo';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.id]: e.target.value.trim() }); //trim() - to remove sapces
    }
    //console.log(formData);
    const handleSubmit =  async (e) => {    // async has a wait()
      e.preventDefault();  // prevents form refreshing the page
      if( !formData.username || !formData.email || !formData.password){
        return setErrorMessage('Please Fill out all fields.');
      }
      try {
        setLoading(true);
        setErrorMessage(null);
        const res = await fetch('/api/auth/signup', {
          method : 'POST',
          headers : {'Content-Type': 'application/json'},
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          return setErrorMessage(data.message);
        }
        setLoading(false);
        if(res.ok){
          navigate('/signin');
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage(error.message);
        
      }
    };

  return (
    <div className="min-h-screen flex">

    <div className="absolute top-0 left-0 mt-10 ml-10">
        <Logo />
    </div>
      
      <div className="flex-1 flex flex-col justify-center items-center p-10">
        <h1 className="text-xl font-bold mb-4">SIGN UP</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <Label htmlFor="text" value="Username" />
            <TextInput
              id="username"
              type="text"
              placeholder="Create A Username"
              required
              className="w-full"
              onChange={handleChange}
            />
          </div>
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

                ) : ('Sign Up')
              }
          </Button>
          <OAuth/>
        </form>
        <div className="flex gap-2 text-sm mt-5">
          <span>Have an account?</span>
          <Link to="/signin" className="text-blue-500">Sign In</Link>
          
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
}
