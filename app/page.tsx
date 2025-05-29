'use client';

import { useState } from 'react';
import LoginForm from './components/LoginForm';
import Chat from './components/Chat';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (user: string) => {
    setIsLoggedIn(true);
    setUsername(user);
  };

  return (
    <main className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          {!isLoggedIn ? (
            <LoginForm onLogin={handleLogin} />
          ) : (
            <Chat username={username} />
          )}
        </div>
      </div>
    </main>
  );
} 