import { User } from './user';

export interface Event {
  eventId: number;
  title: string;
  description?: string;
  location: string;
  type?: string;
  visibility?: string;
  status?: string;
  requiredItems?: string;
  imageUrl?: string | null;
  startDateTime: string;
  endDateTime: string;
  creatorUserId: number;
  creator?: User;
  creatorName?: string;
  invitedUserIds?: number[];
  participants?: User[];
}
