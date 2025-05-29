import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { MessageData, Room, UserData } from './types';

const token = localStorage.getItem("token");
const name = localStorage.getItem("name");
let currentRoomId = "general";
let socket: Socket;

if (!token || !name) {
  alert("로그인이 필요합니다.");
  window.location.href = "index.html";
} else {
  document.getElementById("welcome")!.textContent = `환영합니다, ${name}님!`;
  document.getElementById("chatContainer")!.style.display = "block";
}

// Socket.IO 연결
socket = io("https://backend-solitary-sun-4121.fly.dev", {
  secure: true
});

// 연결 상태 확인용 로그
socket.on("connect", () => {
  console.log("소켓 연결 성공!", socket.id);
});

socket.on("connect_error", (err: Error) => {
  console.error("소켓 연결 에러:", err);
});

// 사용자 로그인 처리
socket.emit("user_login", { name });

// 채팅방 목록 업데이트
socket.on("room_list", (rooms: Room[]) => {
  console.log("room_list 수신:", rooms);
  const roomsDiv = document.getElementById("rooms")!;
  roomsDiv.innerHTML = rooms
    .map(room => `
      <div class="room-item ${room.id === currentRoomId ? 'active' : ''}" 
           onclick="joinRoom('${room.id}')">
        <div class="user-avatar">${room.name.charAt(0).toUpperCase()}</div>
        ${room.name}
        <span class="user-count">${room.userCount}명</span>
      </div>
    `)
    .join("");
});

// 온라인 사용자 목록 업데이트
socket.on("user_list", (users: UserData[]) => {
  console.log("user_list 수신:", users);
  const onlineUsersDiv = document.getElementById("onlineUsers")!;
  onlineUsersDiv.innerHTML = users
    .map(user => `
      <div class="online-user">
        <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
        ${user.name}
      </div>
    `)
    .join("");
});

// 메시지 수신
socket.on("receive_message", (messageData: MessageData) => {
  console.log("메시지 수신:", messageData);
  const chat = document.getElementById("chat")!;
  const messageContainer = document.createElement("div");
  messageContainer.className = `message-container ${messageData.sender === name ? 'sent' : 'received'}`;
  
  const avatar = document.createElement("div");
  avatar.className = "user-avatar";
  avatar.textContent = messageData.sender.charAt(0).toUpperCase();
  
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${messageData.sender === name ? 'sent' : 'received'}`;
  const time = new Date(messageData.timestamp!).toLocaleTimeString();
  messageDiv.innerHTML = `
    <span class="sender">${messageData.sender}</span>
    <span class="time">${time}</span>
    <div class="content">${messageData.message}</div>
  `;
  
  messageContainer.appendChild(avatar);
  messageContainer.appendChild(messageDiv);
  chat.appendChild(messageContainer);
  chat.scrollTop = chat.scrollHeight;
});

// 채팅방 참가 함수
function joinRoom(roomId: string) {
  currentRoomId = roomId;
  socket.emit("join_room", roomId);
  document.getElementById("currentRoom")!.textContent = `현재 채팅방: ${roomId}`;
  document.getElementById("chat")!.innerHTML = ""; // 채팅 내용 초기화
}

// 전역 스코프에 함수 노출
(window as any).joinRoom = joinRoom;

// 새 채팅방 만들기
document.getElementById("createRoomBtn")!.addEventListener("click", () => {
  const roomName = prompt("새 채팅방 이름을 입력하세요:");
  if (roomName) {
    joinRoom(roomName);
  }
});

// 메시지 전송
document.getElementById("sendBtn")!.addEventListener("click", () => {
  const input = document.getElementById("messageInput") as HTMLInputElement;
  const message = input.value.trim();
  if (message) {
    socket.emit("send_message", {
      sender: name,
      message: message,
      roomId: currentRoomId
    });
    input.value = "";
  }
});

// Enter 키로 메시지 전송
document.getElementById("messageInput")!.addEventListener("keypress", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    document.getElementById("sendBtn")!.click();
  }
});

// 로그아웃
document.getElementById("logoutBtn")!.addEventListener("click", () => {
  socket.disconnect();
  localStorage.clear();
  window.location.href = "index.html";
});