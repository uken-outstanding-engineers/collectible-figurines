export interface PublicUser {
  id: number;
  username: string;
  avatarUrl: string;
}

export interface ChatMessage {
  id: number | null;
  content: string;
  seen: boolean;
  date: string;
  sender: PublicUser;
  recipient: PublicUser;
}