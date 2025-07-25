import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from './api-url';
import { PublicUser } from './user-public.model';

@Injectable({
  providedIn: 'root',
})
export class FriendshipsService {
  private API_URL = `${API_URL.BASE_URL}/api/friendships`;

  constructor(private http: HttpClient) {}

  acceptFriendRequest(payload: { userId1: number, userId2: number }) {
    return this.http.post(`${this.API_URL}/add`, payload, { responseType: 'text' });
  }

  removeFriend(payload: { userId1: number; userId2: number }): Observable<any> {
    return this.http.post(`${this.API_URL}/remove`, payload, { responseType: 'text' });
  }

  checkFriendship(userId1: number, userId2: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/check/${userId1}/${userId2}`);
  }

  getFriends(userId: number): Observable<PublicUser[]> {
    return this.http.get<PublicUser[]>(`${this.API_URL}/friends/${userId}`);
  }
}
