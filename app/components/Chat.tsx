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

    newSocket.on('room_list', (roomList: Room[]) => {
      console.log('room_list:', roomList); 
      setRooms(roomList);
    });

    newSocket.on('user_list', (users: UserData[]) => {
      console.log('user_list:', users); 
      setOnlineUsers(users);
    });

    newSocket.on('receive_message', (message: Message) => {
      console.log('receive_message:', message); 
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
    <div className="flex h-screen bg-gray-100">
      {/* 사이드바 */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">채팅방</h2>
          <button
            onClick={createRoom}
            className="mt-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            새 채팅방 만들기
          </button>
        </div>
        <div className="p-4">
          {rooms.map(room => (
            <div
              key={room.id}
              onClick={() => joinRoom(room.id)}
              className={`flex items-center p-2 cursor-pointer rounded-md ${
                room.id === currentRoom ? 'bg-indigo-100' : 'hover:bg-gray-100'
              }`}
            >
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-2">
                {room.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-medium">{room.name}</div>
                <div className="text-sm text-gray-500">{room.userCount}명</div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <h3 className="font-bold mb-2">온라인 사용자</h3>
          {onlineUsers.map(user => (
            <div key={user.name} className="flex items-center p-2">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-2">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>{user.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 메인 채팅 영역 */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-white shadow-sm">
          <h1 className="text-xl font-bold">현재 채팅방: {currentRoom}</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === username ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className="flex items-end space-x-2">
                {message.sender !== username && (
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                    {message.sender.charAt(0).toUpperCase()}
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === username
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <div className="text-sm font-semibold">{message.sender}</div>
                  <div>{message.message}</div>
                  <div className="text-xs opacity-75">
                    {message.timestamp && new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                {message.sender === username && (
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                    {message.sender.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="p-4 bg-white border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
