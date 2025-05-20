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
