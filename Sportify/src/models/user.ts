export interface User {
  userId: number
  name: string
  email: string
  password: string
  userType?: string
  username?: string;
  imageUrl?: string;
  status?: 'Pending' | 'Approved' | 'Rejected' | 'Invited';
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  userId: number
  userType: string
}
