export interface User {
    id: number;
    email: string;
    username: string;
    password: string;
    permission: string;
    lastLogin: string | number | Date;
    avatarUrl: string | null;
  }
  