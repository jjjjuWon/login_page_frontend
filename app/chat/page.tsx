'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Chat from '../components/Chat';

export default function ChatPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');

    if (!token || !name) {
      alert('로그인이 필요합니다.');
      router.replace('/');
    } else {
      setUsername(name);
    }
  }, []);

  if (!username) {
    return <div className="p-10 text-gray-500">인증 확인 중...</div>;
  }

  return <Chat username={username} />;
}
