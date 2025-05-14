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
