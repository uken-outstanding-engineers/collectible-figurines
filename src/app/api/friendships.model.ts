export interface PublicUser {
  id: number;
  username: string;
  avatarUrl: string;
}

export interface Friendship {
  id?: number;
  user1: PublicUser;
  user2: PublicUser;
  createdAt: string;
}
