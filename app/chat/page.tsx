'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Chat from '../components/Chat';

export default function ChatPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('name');

      if (!token || !name) {
        alert('로그인이 필요합니다.');
        router.replace('/');
      } else {
        setUsername(name);
      }
    }
  }, [router]);

  if (!username) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        인증 확인 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-5">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">환영합니다, {username}님!</h1>
          <button
            onClick={() => {
              localStorage.clear();
              router.replace('/');
            }}
            className="bg-[#fee500] text-[#3c1e1e] px-5 py-2.5 rounded-lg border-none cursor-pointer"
          >
            로그아웃
          </button>
        </div>
        <Chat username={username} />
      </div>
    </div>
  );
}
