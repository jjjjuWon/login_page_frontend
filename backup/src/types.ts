export interface User {
  name: string;
  email: string;
  pw: string;
}

export interface LoginResponse {
  message: string;
  token?: string;
  name?: string;
}

export interface MessageData {
  sender: string;
  message: string;
  roomId?: string;
  timestamp?: string;
}

export interface Room {
  id: string;
  name: string;
  userCount: number;
}

export interface UserData {
  name: string;
} 