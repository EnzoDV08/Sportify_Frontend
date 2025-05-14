export interface Event {
  eventId: number;
  title: string;
  description?: string;
  date: string;
  location: string;
  type?: string;
  visibility?: string;
  status?: string;
  creatorId?: number;
}
