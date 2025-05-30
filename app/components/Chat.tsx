'use client';

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

interface ChatProps {
  username: string;
}

interface Message {
  sender: string;
  message: string;
  timestamp?: string;
  roomId: string;
}

interface Room {
  id: string;
  name: string;
  userCount: number;
}

interface UserData {
  name: string;
}

export default function Chat({ username }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserData[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io('https://backend-solitary-sun-4121.fly.dev', {
      secure: true,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('소켓 연결 성공!', newSocket.id);
      newSocket.emit('user_login', { name: username });
      newSocket.emit('join_room', 'general');
    });

    newSocket.on('connect_error', (err) => {
      console.error('소켓 연결 실패:', err);
      alert('서버와 연결할 수 없습니다. 나중에 다시 시도해주세요.');
    });

    newSocket.on('room_list', (roomList: Room[]) => {
      setRooms(roomList);
    });

    newSocket.on('user_list', (users: UserData[]) => {
      setOnlineUsers(users);
    });

    newSocket.on('receive_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      newSocket.close();
    };
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinRoom = (roomId: string) => {
    if (socket) {
      setCurrentRoom(roomId);
      socket.emit('join_room', roomId);
      setMessages([]);
    }
  };

  const createRoom = () => {
    const roomName = prompt('새 채팅방 이름을 입력하세요:');
    if (roomName && socket) {
      joinRoom(roomName);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const messageData = {
        sender: username,
        message: newMessage,
        roomId: currentRoom,
        timestamp: new Date().toISOString()
      };
      socket.emit('send_message', messageData);
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 p-4 max-w-screen-xl mx-auto">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 border-r border-gray-300 bg-white rounded-lg shadow-md p-4 flex flex-col">
        <div>
          <h2 className="text-lg font-bold mb-2">채팅방 목록</h2>
          <button
            onClick={createRoom}
            className="w-full mb-4 px-4 py-2 bg-yellow-300 text-[#3c1e1e] rounded-lg font-semibold hover:bg-yellow-400"
          >
            + 새 채팅방
          </button>
          <div className="space-y-2">
            {rooms.map(room => (
              <div
                key={room.id}
                onClick={() => joinRoom(room.id)}
                className={`flex items-center px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition ${
                  room.id === currentRoom ? 'bg-yellow-300 text-[#3c1e1e]' : ''
                }`}
              >
                <div className="w-8 h-8 bg-yellow-300 text-[#3c1e1e] rounded-full flex items-center justify-center mr-2 font-bold">
                  {room.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 font-medium">{room.name}</div>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{room.userCount}명</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-bold mb-2">현재 사용자</h3>
          <div className="space-y-2">
            {onlineUsers.map(user => (
              <div key={user.name} className="flex items-center">
                <div className="w-8 h-8 bg-yellow-300 text-[#3c1e1e] rounded-full flex items-center justify-center mr-2 font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>{user.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat content */}
      <div className="flex-1 flex flex-col ml-4">
        <div className="p-4 bg-yellow-300 text-[#3c1e1e] font-bold rounded-lg text-center mb-2">
          현재 채팅방: {currentRoom}
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === username ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className={`flex items-start gap-2 ${
                message.sender === username ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <div className="w-10 h-10 bg-yellow-300 text-[#3c1e1e] rounded-full flex justify-center items-center font-bold">
                  {message.sender.charAt(0).toUpperCase()}
                </div>
                <div className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === username ? 'bg-yellow-300 text-[#3c1e1e]' : 'bg-white border'
                }`}>
                  <div className="font-bold">{message.sender}</div>
                  <div className="break-words">{message.message}</div>
                  <div className="text-xs text-gray-500">{new Date(message.timestamp!).toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="mt-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-300"
              placeholder="메시지를 입력하세요..."
            />
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-300 text-[#3c1e1e] font-bold rounded-full hover:bg-yellow-400"
            >
              보내기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
