// frontend/src/components/Login.jsx
import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import PopUp from './PopUp';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${baseURL}/user/login`, input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        setShowPopUp(true); // Show the pop-up after successful login
        toast.success(res.data.message);
        setInput({
          email: '',
          password: ''
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, []);

  const handleClosePopUp = () => {
    setShowPopUp(false);
    navigate('/'); // Navigate to the main post page after closing the pop-up
  };

  return (
    <div className='flex items-center w-screen h-screen justify-center' style={{ background: 'url(/background.jpg) no-repeat center center fixed', backgroundSize: 'cover' }}>
      {showPopUp && <PopUp onClose={handleClosePopUp} />}
      {!showPopUp && (
        <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
          <div className='my-4 text-center'>
            <img src='/image.png' alt='LOGO' style={{ width: '300px', height: 'auto' }} />
            <p className='text-sm'>Login to see photos from your friends</p>
          </div>
          <div>
            <span className='font-medium'>Email</span>
            <Input
              type='email'
              name='email'
              value={input.email}
              onChange={changeEventHandler}
              className='focus-visible:ring-transparent my-2'
            />
          </div>
          <div>
            <span className='font-medium'>Password</span>
            <Input
              type='password'
              name='password'
              value={input.password}
              onChange={changeEventHandler}
              className='focus-visible:ring-transparent my-2'
            />
          </div>
          {loading ? (
            <Button>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button type='submit'>Login</Button>
          )}
          <span className='text-center'>
            Dosent have an account? <Link to='/signup' className='text-blue-600'>Signup</Link>
          </span>
        </form>
      )}
    </div>
  );
};

export default Login;
