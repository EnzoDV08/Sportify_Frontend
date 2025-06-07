export interface Friend {
  id: number;
  userId: number;
  friendId: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface FriendRequestDto {
  senderId: number;
  receiverId: number;
}

export interface FullFriend {
  id: number;
  friend: {
    userId: number;
    name: string;
    profilePicture: string;
    bio?: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
}
