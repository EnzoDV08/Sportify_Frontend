export interface JoinRequest {
  eventId: number;
  userId: number;
  status: string;
  user: {
    userId: number;
    name: string;
    email: string;
    profilePicture?: string;
  };
  event: {
    eventId: number;
    title: string;
  };
}