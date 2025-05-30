'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  onLogin: (username: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('token', 'admin-token');
      localStorage.setItem('name', '관리자');
      alert('👑 관리자 로그인 성공!');
      onLogin('관리자');
      router.push('/chat');
    } else {
      // 회원가입처럼 처리 (임시 토큰 발급)
      const isNewUser = !localStorage.getItem(`user-${username}`);
      if (isNewUser) {
        alert('회원가입 완료! 자동 로그인합니다.');
        localStorage.setItem(`user-${username}`, password);
      } else {
        const storedPw = localStorage.getItem(`user-${username}`);
        if (storedPw !== password) {
          alert('비밀번호가 일치하지 않습니다.');
          return;
        }
      }

      localStorage.setItem('token', 'user-token');
      localStorage.setItem('name', username);
      alert('로그인 성공!');
      onLogin(username);
      router.push('/chat');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign in
      </button>
    </form>
  );
}
