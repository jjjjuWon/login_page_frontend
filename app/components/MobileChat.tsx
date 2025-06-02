'use client';

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styles from './mobileChat.module.css';
import { useRouter } from 'next/navigation';

interface ChatProps {
  username: string;
}

interface Message {
  sender: string;
  message: string;
  timestamp?: string;
  roomId: string;
  messageId?: string;
}

interface Room {
  id: string;
  name: string;
  userCount: number;
}

export default function MobileChat({ username }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [currentRoom, setCurrentRoom] = useState('General');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showRoomList, setShowRoomList] = useState(false);
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
      newSocket.emit('join_room', 'General');
    });

    newSocket.on('connect_error', (err) => {
      console.error('소켓 연결 실패:', err);
      alert('서버와 연결할 수 없습니다. 나중에 다시 시도해주세요.');
    });

    newSocket.on('room_list', (roomList: Room[]) => {
      setRooms(roomList);
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
      setShowRoomList(false);
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
        timestamp: new Date().toISOString(),
        messageId: `${socket.id}-${Date.now()}`
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
      <div className={styles.header}>
        <button className={styles.menuButton} onClick={() => setShowRoomList(!showRoomList)}>
          ☰
        </button>
        <h2>{currentRoom}</h2>
        <button className={styles.logoutButton} onClick={logout}>로그아웃</button>
      </div>

      {showRoomList ? (
        <div className={styles.roomList}>
          <button className={styles.createRoomButton} onClick={createRoom}>
            새 채팅방 만들기
          </button>
          {rooms.map(room => (
            <div
              key={room.id}
              className={`${styles.roomItem} ${room.id === currentRoom ? styles.active : ''}`}
              onClick={() => joinRoom(room.id)}
            >
              <div className={styles.roomAvatar}>{room.name.charAt(0).toUpperCase()}</div>
              <div className={styles.roomInfo}>
                <span className={styles.roomName}>{room.name}</span>
                <span className={styles.userCount}>{room.userCount}명</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className={styles.chatBox}>
            {messages.map((message) => {
              const isMine = message.sender === username;
              const formattedTime = new Date(message.timestamp!).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={message.messageId}
                  className={`${styles.messageContainer} ${isMine ? styles.sent : styles.received}`}
                >
                  {!isMine && (
                    <div className={styles.userAvatar}>
                      {message.sender.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className={styles.messageContent}>
                    {!isMine && <div className={styles.senderName}>{message.sender}</div>}
                    <div className={`${styles.messageBubble} ${isMine ? styles.sent : styles.received}`}>
                      {message.message}
                    </div>
                    <div className={styles.messageTime}>{formattedTime}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className={styles.inputForm}>
            <div className={styles.inputIcons}>
              {/* 여기에 아이콘 버튼들이 들어간다. */}
            </div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className={styles.messageInput}
              placeholder="메시지를 입력하세요"
            />
            <button type="submit" className={styles.sendButton}>전송</button>
          </form>
        </>
      )}
    </div>
  );
} 