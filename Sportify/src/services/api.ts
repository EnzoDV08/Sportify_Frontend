import { Event } from '../models/event'
import { User } from '../models/user'
import {
  UserAchievement,
  FullAchievement,
  CreateAchievementRequest,
  AssignAchievementRequest,
} from '../models/achievement'
import { Admin } from '../models/admin'

export interface CreateEventDto {
  title: string
  description?: string
  date: string
  location: string
  type?: string
  visibility?: string
  status?: string
  adminId?: number
}

// EVENTS
export const fetchEvents = async (): Promise<Event[]> => {
  const response = await fetch('http://localhost:5000/api/events')
  if (!response.ok) throw new Error('Failed to fetch events')
  return await response.json()
}

export const fetchSingleEvent = async (id: number): Promise<Event> => {
  const response = await fetch(`http://localhost:5000/api/events/${id}`)
  if (!response.ok) throw new Error('Failed to fetch event')
  return await response.json()
}

export const createEvent = async (
  eventData: CreateEventDto,
  userId: number
): Promise<Event> => {
  const response = await fetch(`http://localhost:5000/api/events?userId=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  })

  if (!response.ok) {
    console.error(await response.text())
    throw new Error('Failed to create event.')
  }

  return await response.json()
}

export const fetchEventsByAdmin = async (adminId: number): Promise<Event[]> => {
  const response = await fetch(`http://localhost:5000/api/events/by-admin/${adminId}`)
  if (!response.ok) throw new Error('Failed to fetch events by admin')
  return await response.json()
}

export const fetchEventParticipants = async (eventId: number): Promise<User[]> => {
  const response = await fetch(`http://localhost:5000/api/events/${eventId}/participants`)
  if (!response.ok) throw new Error('Failed to fetch event participants')
  return await response.json()
}

// LOGIN
import { LoginRequest, LoginResponse } from '../models/user'

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch('http://localhost:5000/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) throw new Error('Login failed')
  return await response.json()
}

// ACHIEVEMENTS

export const fetchUserAchievements = async (
  userId: number
): Promise<UserAchievement[]> => {
  const response = await fetch(`http://localhost:5000/api/achievements/user/${userId}`)
  if (!response.ok) throw new Error(`❌ Failed to fetch achievements for user ${userId}`)
  return await response.json()
}

export const fetchAllAchievements = async (): Promise<FullAchievement[]> => {
  const response = await fetch('http://localhost:5000/api/achievements')
  if (!response.ok) throw new Error('❌ Failed to fetch all achievements')
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

const API_BASE_URL = 'http://localhost:5000/api' 

export const fetchAdminDetails = async (): Promise<Admin> => {
  const response = await fetch(`${API_BASE_URL}/admins/11`)
  if (!response.ok) throw new Error('Failed to fetch admin data')
  return await response.json()
}