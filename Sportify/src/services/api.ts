import { Event } from '../models/event';

// Get all events
export const fetchEvents = async (): Promise<Event[]> => {
  const response = await fetch('http://localhost:5000/api/events');
  if (!response.ok) throw new Error('Failed to fetch events');
  return await response.json();
};

// Get one event by ID
export const fetchSingleEvent = async (id: number): Promise<Event> => {
  const response = await fetch(`http://localhost:5000/api/events/${id}`);
  if (!response.ok) throw new Error('Failed to fetch event');
  return await response.json();
};

// Login
import { LoginRequest, LoginResponse } from '../models/user';

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch('http://localhost:5000/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) throw new Error('Login failed');
  return await response.json();
};

import {
  UserAchievement,
  FullAchievement,
  CreateAchievementRequest,
  AssignAchievementRequest
} from '../models/achievement';



export const fetchUserAchievements = async (
  userId: number
): Promise<UserAchievement[]> => {
  const response = await fetch(`http://localhost:5000/api/achievements/user/${userId}`)
  if (!response.ok) {
    throw new Error(`❌ Failed to fetch achievements for user ${userId}`)
  }
  return await response.json()
}


export const fetchAllAchievements = async (): Promise<FullAchievement[]> => {
  const response = await fetch('http://localhost:5000/api/achievements')
  if (!response.ok) {
    throw new Error('❌ Failed to fetch all achievements')
  }
  return await response.json()
}


export const createAchievement = async (
  data: CreateAchievementRequest
): Promise<boolean> => {
  const response = await fetch('http://localhost:5000/api/achievements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    console.error(await response.text())
    throw new Error('❌ Failed to create achievement')
  }

  return true
}


export const assignAchievement = async (
  data: AssignAchievementRequest
): Promise<boolean> => {
  const response = await fetch('http://localhost:5000/api/achievements/assign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    console.error(await response.text())
    throw new Error('❌ Failed to assign achievement')
  }

  return true
}

