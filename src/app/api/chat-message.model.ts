import { Trade } from './trade.model';

export interface PublicUser {
  id: number;
  username: string;
  avatarUrl: string | null;
}

export interface ChatMessage {
  id: number | null;
  content: string;
  seen: boolean;
  date: string;
  sender: PublicUser;
  recipient: PublicUser;
  trade?: Trade;
}