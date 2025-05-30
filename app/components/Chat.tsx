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
    <div className="container">
      <div className="sidebar">
        <div id="roomList">
          <h3>채팅방 목록</h3>
          <button id="createRoomBtn" onClick={createRoom}>새 채팅방 만들기</button>
          <div>
            {rooms.map(room => (
              <div
                key={room.id}
                className={`room-item ${room.id === currentRoom ? 'active' : ''}`}
                onClick={() => joinRoom(room.id)}
              >
                <div className="user-avatar">{room.name.charAt(0).toUpperCase()}</div>
                {room.name}
                <span className="user-count">{room.userCount}명</span>
              </div>
            ))}
          </div>
        </div>
        <div id="userList">
          <h3>현재 채팅방 사용자</h3>
          <div>
            {onlineUsers.map(user => (
              <div key={user.name} className="online-user">
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                {user.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="current-room">현재 채팅방: {currentRoom}</div>
        <div id="chat">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-container ${message.sender === username ? 'sent' : 'received'}`}
            >
              <div className="user-avatar">{message.sender.charAt(0).toUpperCase()}</div>
              <div className={`message ${message.sender === username ? 'sent' : 'received'}`}>
                <span className="sender">{message.sender}</span>
                <span className="time">{new Date(message.timestamp!).toLocaleTimeString()}</span>
                <div className="content">{message.message}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            id="messageInput"
            placeholder="메시지를 입력하세요"
          />
          <button type="submit" id="sendBtn">보내기</button>
        </form>
      </div>
    </div>
  );
}
