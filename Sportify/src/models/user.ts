export interface User {
  userId: number;
  name: string;
  email: string;
  password: string;
  userType?: string; // "user" or "admin"
}