'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    localStorage.setItem('name', data.name?.toString() || data.email?.toString() || '');
    localStorage.setItem('token', 'dummy-token');
    router.push('/chat');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ebecf0]">
      <div className="relative w-[768px] min-h-[480px] bg-white rounded-lg shadow-lg overflow-hidden">

        {/* Sign In */}
        <div className={`absolute left-0 w-1/2 h-full transition-all duration-500 ease-in-out 
          ${isSignUp ? 'translate-x-full opacity-0 z-0' : 'translate-x-0 opacity-100 z-10'}`}>
          <form onSubmit={handleSubmit} className="bg-[#ebecf0] flex flex-col px-12 h-full justify-center items-center">
            <h1 className="font-bold text-2xl mb-4">Sign In</h1>
            <input type="email" name="email" placeholder="Email" required className="form-input-style" />
            <input type="password" name="password" placeholder="Password" required className="form-input-style" />
            <button type="submit" className="form-btn-style">Sign In</button>
          </form>
        </div>

        {/* Sign Up */}
        <div className={`absolute left-0 w-1/2 h-full transition-all duration-500 ease-in-out 
          ${isSignUp ? 'translate-x-0 opacity-100 z-10' : 'translate-x-full opacity-0 z-0'}`}>
          <form onSubmit={handleSubmit} className="bg-[#ebecf0] flex flex-col px-12 h-full justify-center items-center">
            <h1 className="font-bold text-2xl mb-4">Create Account</h1>
            <input type="text" name="name" placeholder="Name" required className="form-input-style" />
            <input type="email" name="email" placeholder="Email" required className="form-input-style" />
            <input type="password" name="password" placeholder="Password" required className="form-input-style" />
            <button type="submit" className="form-btn-style">Sign Up</button>
          </form>
        </div>

        {/* Overlay */}
        <div className="absolute top-0 left-1/2 w-1/2 h-full transition-all duration-500 ease-in-out z-20">
          <div className={`absolute inset-0 transition-transform duration-500 ease-in-out 
            ${isSignUp ? '-translate-x-full' : 'translate-x-0'} bg-[#ff4b2b] text-white flex flex-col justify-center items-center`}>
            {isSignUp ? (
              <>
                <h1 className="text-2xl font-bold mb-4">Welcome Back!</h1>
                <p className="text-sm text-center mb-6">To keep connected, please log in with your personal info</p>
                <button onClick={() => setIsSignUp(false)} className="form-btn-style bg-white text-[#ff4b2b]">Sign In</button>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-4">Hello, Friend!</h1>
                <p className="text-sm text-center mb-6">Enter your personal details and start your journey with us</p>
                <button onClick={() => setIsSignUp(true)} className="form-btn-style bg-white text-[#ff4b2b]">Sign Up</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
