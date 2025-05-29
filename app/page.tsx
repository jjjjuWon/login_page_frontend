'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // TODO: API 연동
    localStorage.setItem('name', data.name as string);
    localStorage.setItem('token', 'dummy-token');
    router.push('/chat');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ebecf0]">
      <div className="relative w-[768px] min-h-[480px] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className={`sign-in-container absolute left-0 w-1/2 h-full transition-all duration-500 ${isSignUp ? 'translate-x-full opacity-0' : 'opacity-100'}`}>
          <form onSubmit={handleSubmit} className="bg-[#ebecf0] flex flex-col px-12 h-full justify-center items-center">
            <h1 className="font-bold text-2xl mb-4">Sign In</h1>
            <div className="social-links mb-5">
              <div className="inline-flex justify-center items-center w-10 h-10 mx-1 rounded-full shadow-[inset_-5px_-5px_10px_#fff,inset_5px_5px_8px_#babebc]">
                <a href="#" className="text-black"><i className="fa fa-facebook"></i></a>
              </div>
              <div className="inline-flex justify-center items-center w-10 h-10 mx-1 rounded-full shadow-[inset_-5px_-5px_10px_#fff,inset_5px_5px_8px_#babebc]">
                <a href="#" className="text-black"><i className="fa fa-twitter"></i></a>
              </div>
              <div className="inline-flex justify-center items-center w-10 h-10 mx-1 rounded-full shadow-[inset_-5px_-5px_10px_#fff,inset_5px_5px_8px_#babebc]">
                <a href="#" className="text-black"><i className="fa fa-linkedin"></i></a>
              </div>
            </div>
            <span className="text-xs mb-4">or use your account</span>
            <input type="email" name="email" placeholder="Email" required 
              className="w-[85%] p-4 my-2 border-0 outline-none rounded-[20px] shadow-[inset_7px_2px_10px_#babebc,inset_-5px_-5px_12px_#fff]" />
            <input type="password" name="password" placeholder="Password" required 
              className="w-[85%] p-4 my-2 border-0 outline-none rounded-[20px] shadow-[inset_7px_2px_10px_#babebc,inset_-5px_-5px_12px_#fff]" />
            <button type="submit" 
              className="rounded-[20px] border-none outline-none text-xs font-bold py-4 px-11 my-3.5 uppercase cursor-pointer transition-transform duration-80 ease-in shadow-[-5px_-5px_10px_#fff,5px_5px_8px_#babebc]">
              Sign In
            </button>
          </form>
        </div>

        <div className={`sign-up-container absolute left-0 w-1/2 h-full transition-all duration-500 ${isSignUp ? 'translate-x-full opacity-100 z-10' : 'opacity-0'}`}>
          <form onSubmit={handleSubmit} className="bg-[#ebecf0] flex flex-col px-12 h-full justify-center items-center">
            <h1 className="font-bold text-2xl mb-4">Create Account</h1>
            <div className="social-links mb-5">
              <div className="inline-flex justify-center items-center w-10 h-10 mx-1 rounded-full shadow-[inset_-5px_-5px_10px_#fff,inset_5px_5px_8px_#babebc]">
                <a href="#" className="text-black"><i className="fa fa-facebook"></i></a>
              </div>
              <div className="inline-flex justify-center items-center w-10 h-10 mx-1 rounded-full shadow-[inset_-5px_-5px_10px_#fff,inset_5px_5px_8px_#babebc]">
                <a href="#" className="text-black"><i className="fa fa-twitter"></i></a>
              </div>
              <div className="inline-flex justify-center items-center w-10 h-10 mx-1 rounded-full shadow-[inset_-5px_-5px_10px_#fff,inset_5px_5px_8px_#babebc]">
                <a href="#" className="text-black"><i className="fa fa-linkedin"></i></a>
              </div>
            </div>
            <span className="text-xs mb-4">or use your email for registration</span>
            <input type="text" name="name" placeholder="Name" required 
              className="w-[85%] p-4 my-2 border-0 outline-none rounded-[20px] shadow-[inset_7px_2px_10px_#babebc,inset_-5px_-5px_12px_#fff]" />
            <input type="email" name="email" placeholder="Email" required 
              className="w-[85%] p-4 my-2 border-0 outline-none rounded-[20px] shadow-[inset_7px_2px_10px_#babebc,inset_-5px_-5px_12px_#fff]" />
            <input type="password" name="password" placeholder="Password" required 
              className="w-[85%] p-4 my-2 border-0 outline-none rounded-[20px] shadow-[inset_7px_2px_10px_#babebc,inset_-5px_-5px_12px_#fff]" />
            <button type="submit" 
              className="rounded-[20px] border-none outline-none text-xs font-bold py-4 px-11 my-3.5 uppercase cursor-pointer transition-transform duration-80 ease-in shadow-[-5px_-5px_10px_#fff,5px_5px_8px_#babebc]">
              Sign Up
            </button>
          </form>
        </div>

        <div className="overlay-container">
          <div className={`overlay-left absolute right-0 w-1/2 h-full transition-all duration-500 ${isSignUp ? 'translate-x-[-100%] opacity-0' : 'opacity-100'}`}>
            <div className="flex flex-col px-12 h-full justify-center items-center bg-[#ff4b2b] text-white">
              <h1 className="font-bold text-2xl mb-4">Welcome Back!</h1>
              <p className="text-base font-bold tracking-wider my-5">To keep connected with us please login with your personal info</p>
              <button onClick={() => setIsSignUp(false)} 
                className="rounded-[20px] border-none outline-none text-xs font-bold py-4 px-11 my-3.5 uppercase cursor-pointer transition-transform duration-80 ease-in bg-[#ff4b2b] text-white shadow-[-5px_-5px_10px_#ff6b3f,5px_5px_8px_#bf4b2b]">
                Sign In
              </button>
            </div>
          </div>

          <div className={`overlay-right absolute right-0 w-1/2 h-full transition-all duration-500 ${isSignUp ? 'translate-x-[-100%] opacity-0' : 'opacity-100'}`}>
            <div className="flex flex-col px-12 h-full justify-center items-center bg-[#ff4b2b] text-white">
              <h1 className="font-bold text-2xl mb-4">Hello, Friend!</h1>
              <p className="text-base font-bold tracking-wider my-5">Enter your personal details and start journey with us</p>
              <button onClick={() => setIsSignUp(true)} 
                className="rounded-[20px] border-none outline-none text-xs font-bold py-4 px-11 my-3.5 uppercase cursor-pointer transition-transform duration-80 ease-in bg-[#ff4b2b] text-white shadow-[-5px_-5px_10px_#ff6b3f,5px_5px_8px_#bf4b2b]">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 