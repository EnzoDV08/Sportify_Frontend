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
  adminId?: number;
  invitedUserIds?: number[] | null;
  isPrivate?: boolean;
  latitude?: number | null;
  longitude?: number | null;
}
