'use client';

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styles from './chat.module.css';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <button onClick={logout} style={{ marginBottom: '10px' }}>로그아웃</button>

        <div id="roomList">
          <h3>채팅방 목록</h3>
          <button id="createRoomBtn" onClick={createRoom}>새 채팅방 만들기</button>
          <div>
            {rooms.map(room => (
              <div
                key={room.id}
                className={`${styles['room-item']} ${room.id === currentRoom ? styles.active : ''}`}
                onClick={() => joinRoom(room.id)}
              >
                <div className={styles['user-avatar']}>{room.name.charAt(0).toUpperCase()}</div>
                {room.name}
                <span className={styles['user-count']}>{room.userCount}명</span>
              </div>
            ))}
          </div>
        </div>

        <div id="userList">
          <h3>현재 채팅방 사용자</h3>
          <div>
            {onlineUsers.map(user => (
              <div key={user.name} className={styles['online-user']}>
                <div className={styles['user-avatar']}>{user.name.charAt(0).toUpperCase()}</div>
                {user.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles['main-content']}>
        <div className={styles['current-room']}>현재 채팅방: {currentRoom}</div>
        <div id="chat" className={styles.chatBox}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles['message-container']} ${message.sender === username ? styles.sent : styles.received}`}
            >
              <div className={styles['user-avatar']}>{message.sender.charAt(0).toUpperCase()}</div>
              <div className={`${styles.message} ${message.sender === username ? styles.sent : styles.received}`}>
                <span className={styles.sender}>{message.sender}</span>
                <span className={styles.time}>{new Date(message.timestamp!).toLocaleTimeString()}</span>
                <div className={styles.content}>{message.message}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
      </div>
        <form onSubmit={sendMessage} className={styles.formWrapper}>
          <div className={styles.inputRow}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className={styles.messageInput}
              placeholder="메시지를 입력하세요"
            />
            <button type="submit" className={styles.sendBtn}>보내기</button>
          </div>
        </form>
      </div>
    </div>
  );
}
