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
  user: {
    userId: number;
    name: string;
    email: string;
  };
  profile: {
    userId: number;
    profilePicture: string;
    bio: string;
    favoriteSports: string;
    totalPoints: number;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'none';
}
