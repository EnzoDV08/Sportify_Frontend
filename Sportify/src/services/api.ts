import { Event } from '../models/event';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define what data is needed to create an event
interface CreateEventDto {
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  type?: string;
  visibility?: string;
  status?: string;
  requiredItems?: string;
  imageUrl?: string | null;
  invitedUserIds?: number[];
}

// Get all events
export const fetchEvents = async (): Promise<Event[]> => {
  const response = await fetch(`${API_BASE_URL}/api/events`);
  if (!response.ok) throw new Error('Failed to fetch events');
  return await response.json();
};

// Get one event by ID
export const fetchSingleEvent = async (id: number): Promise<Event> => {
  const response = await fetch(`${API_BASE_URL}/api/events/${id}`);
  if (!response.ok) throw new Error('Failed to fetch event');
  return await response.json();
};

// Create a new event
export const createEvent = async (eventData: CreateEventDto, userId: number): Promise<Event> => {
  const response = await fetch(`${API_BASE_URL}/api/events?userId=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error('Failed to create event.');
  }

  return await response.json();
};

// delete an event by ID
export const deleteEvent = async (eventId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error('Failed to delete event.');
  }
};

// Update an existing event
interface UpdateEventDto extends CreateEventDto {} // reuse same structure

export const updateEvent = async (
  eventId: number,
  eventData: UpdateEventDto
): Promise<Event> => {
  const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error('Failed to update event.');
  }

  return await response.json();
};

// Get events the user is invited to
export const fetchInvitedEvents = async (userId: number): Promise<Event[]> => {
  const response = await fetch(`${API_BASE_URL}/api/EventParticipants/InvitedEvents/${userId}`);
  if (!response.ok) {
    console.error(await response.text());
    throw new Error('Failed to fetch invited events');
  }
  return await response.json();
};

export const acceptInvite = async (eventId: number, userId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/EventParticipants/AcceptInvite?eventId=${eventId}&userId=${userId}`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Failed to accept invite.');
};

export const rejectInvite = async (eventId: number, userId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/EventParticipants/RejectInvite?eventId=${eventId}&userId=${userId}`, {
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error(await response.text() || 'Failed to reject invite');
  }
};

// Login
import { LoginRequest, LoginResponse } from '../models/user';

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch('${API_BASE_URL}/api/users/login', {
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
  const response = await fetch(`${API_BASE_URL}/api/achievements/user/${userId}`)
  if (!response.ok) {
    throw new Error(`❌ Failed to fetch achievements for user ${userId}`)
  }
  return await response.json()
}


export const fetchAllAchievements = async (): Promise<FullAchievement[]> => {
  const response = await fetch('${API_BASE_URL}/api/achievements')
  if (!response.ok) {
    throw new Error('❌ Failed to fetch all achievements')
  }
  return await response.json()
}


export const createAchievement = async (
  data: CreateAchievementRequest
): Promise<boolean> => {
  const response = await fetch('${API_BASE_URL}/api/achievements', {
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
  const response = await fetch('${API_BASE_URL}/api/achievements/assign', {
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

