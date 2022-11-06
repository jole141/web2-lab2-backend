export interface ICheckResult {
  message: string;
  code: number;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface IPData {
  id: number;
  ip: string;
  attempts: number;
  lastAttempt: Date;
}

export interface IComment {
  id: number;
  text: string;
}
