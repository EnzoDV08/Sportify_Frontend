import { Event } from '../models/event';
import { LoginRequest, LoginResponse } from '../models/user';
import {
  UserAchievement,
  FullAchievement,
  CreateAchievementRequest,
  AssignAchievementRequest,
} from '../models/achievement';
import { JoinRequest } from '../models/request';
import { Profile } from '../models/profile';
import { FriendRequestDto, FullFriend } from '../models/Friend';
import {User} from '../models/user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  sportType?: string;
}

interface UpdateEventDto extends CreateEventDto {}

// ===== Events =====
export const fetchEvents = async (): Promise<Event[]> => {
  const response = await fetch(`${API_BASE_URL}/api/events`);
  if (!response.ok) throw new Error('Failed to fetch events');
  return await response.json();
};

export const fetchSingleEvent = async (id: number): Promise<Event> => {
  const response = await fetch(`${API_BASE_URL}/api/events/${id}`);
  if (!response.ok) throw new Error('Failed to fetch event');
  return await response.json();
};

export const fetchEventsByUser = async (userId: number): Promise<Event[]> => {
  const response = await fetch(`${API_BASE_URL}/api/events/created-by/${userId}`);
  if (!response.ok) {
    console.error(await response.text());
    throw new Error('Failed to fetch events created by user.');
  }
  return await response.json();
};

export const fetchEventParticipants = async (): Promise<any[]> => {
  const res = await fetch(`${API_BASE_URL}/api/EventParticipants`);
  if (!res.ok) throw new Error('Failed to fetch participants');
  return await res.json();
};

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

export const deleteEvent = async (eventId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error('Failed to delete event.');
  }
};

export const updateEvent = async (eventId: number, eventData: UpdateEventDto): Promise<Event> => {
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

export const joinEvent = async (eventId: number, userId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/EventParticipants/JoinEvent?eventId=${eventId}&userId=${userId}`, {
    method: 'POST'
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to join event');
  }
};

// ===== Invites =====
export const fetchInvitedEvents = async (userId: number): Promise<Event[]> => {
  const response = await fetch(`${API_BASE_URL}/api/EventParticipants/InvitedEvents/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch invited events');
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

  if (!response.ok) throw new Error(await response.text() || 'Failed to reject invite');
};

// ===== Join Requests =====
export const fetchPendingRequests = async (creatorId: number): Promise<JoinRequest[]> => {
  const res = await fetch(`${API_BASE_URL}/api/EventParticipants/PendingRequests/${creatorId}`);
  if (!res.ok) throw new Error("Failed to fetch pending requests");
  return await res.json();
};

export const approveRequest = async (eventId: number, userId: number, approverUserId: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/api/EventParticipants/ApproveRequest?eventId=${eventId}&userId=${userId}&approverUserId=${approverUserId}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error(await res.text());
};

export const rejectRequest = async (eventId: number, userId: number, approverUserId: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/api/EventParticipants/RejectRequest?eventId=${eventId}&userId=${userId}&approverUserId=${approverUserId}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error(await res.text());
};

// ===== Login =====
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) throw new Error('Login failed');
  return await response.json();
};

// ===== Achievements =====
export const fetchUserAchievements = async (userId: number): Promise<UserAchievement[]> => {
  const response = await fetch(`${API_BASE_URL}/api/achievements/user/${userId}`);
  if (!response.ok) throw new Error(`Failed to fetch achievements for user ${userId}`);
  return await response.json();
};

export const fetchAllAchievements = async (): Promise<FullAchievement[]> => {
  const response = await fetch(`${API_BASE_URL}/api/achievements`);
  if (!response.ok) throw new Error("Failed to fetch achievements");
  return await response.json();
};


export const createAchievement = async (data: CreateAchievementRequest): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/api/achievements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error('Failed to create achievement');
  }

  return true;
};

export const fetchProfile = async (id: number): Promise<Profile> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Profiles/${id}`);
  if (!response.ok) throw new Error('Failed to fetch profile');
  return await response.json();
};

export const assignAchievement = async (data: AssignAchievementRequest): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/api/UserAchievements/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    console.error(await response.text());
    throw new Error('Failed to assign achievement');
  }
  return true;
};

export const unassignAchievement = async (
  userId: number,
  achievementId: number,
  eventId: number
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/UserAchievements/unassign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, achievementId, eventId }),
  });
  if (!response.ok) throw new Error(await response.text());
};

// Send a friend request
export const sendFriendRequest = async (dto: FriendRequestDto): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/api/friends/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) throw new Error(await res.text());
};

// Accept a friend request
export const acceptFriendRequest = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/api/friends/accept/${id}`, {
    method: 'POST',
  });

  if (!res.ok) throw new Error(await res.text());
};

// Reject a friend request
export const declineFriendRequest = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/api/friends/reject/${id}`, {
    method: 'POST',
  });

  if (!res.ok) throw new Error(await res.text());
};

// Remove a friend
export const removeFriend = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/api/friends/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error(await res.text());
};

// Fetch all accepted friends for a user
export const fetchMyFriends = async (userId: number): Promise<FullFriend[]> => {
  const res = await fetch(`${API_BASE_URL}/api/friends/my-friends/${userId}`);
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// Fetch pending requests for the user
export const fetchFriendRequests = async (userId: number): Promise<FullFriend[]> => {
  const res = await fetch(`${API_BASE_URL}/api/friends/requests/${userId}`);
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const searchUsers = async (query: string, currentUserId: number): Promise<FullFriend[]> => {
  const response = await fetch(`${API_BASE_URL}/api/friends/search?query=${encodeURIComponent(query)}&currentUserId=${currentUserId}`);

  if (!response.ok) throw new Error('Failed to search users');
  return await response.json();
};

export const fetchUserById = async (userId: number): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return await response.json();
};

