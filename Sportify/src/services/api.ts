import { Event } from '../models/event';

export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch('http://localhost:5000/api/events');

    if (!response.ok) {
      // Log the full error response for debugging
      const errorText = await response.text();
      console.error('❌ Server error response:', errorText);
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    const data = await response.json();
    return data as Event[];

  } catch (err) {
    console.error('❌ Error fetching events:', err);
    throw err;
  }
};
