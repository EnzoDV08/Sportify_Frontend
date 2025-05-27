export interface Event {
  eventId: number;
  title: string;
  description?: string;
  location: string;
  type?: string;
  visibility?: string;
  status?: string;
  imageUrl?: string | null;
  requiredItems?: string;
  startDateTime: string;
  endDateTime: string;
  creatorUserId: number;
  adminId?: number;
  invitedUserIds?: number[] | null;
  isPrivate?: boolean;
  latitude?: number | null;
  longitude?: number | null;
}
