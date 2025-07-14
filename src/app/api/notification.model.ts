export interface PublicUser {
  id: number;
  username: string;
  avatarUrl: string;
}

export interface Notification {
  id: number;
  type: string;
  seen: boolean;
  date: string;
  sender: PublicUser;
  recipient: PublicUser;
}