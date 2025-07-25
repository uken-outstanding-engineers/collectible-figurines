import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from './api-url';
import { Notification } from './notification.model';

interface FriendRequestPayload {
  senderId: number | null;
  recipientId: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private API_URL = `${API_URL.BASE_URL}/api/notifications`;

  constructor(private http: HttpClient) {}

  sendFriendRequest(payload: FriendRequestPayload): Observable<string> {
    return this.http.post(`${this.API_URL}/friend-request`, payload, {
        responseType: 'text',
    });
  }

  isFriendRequestSent(senderId: number, recipientId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/friend-request/check?senderId=${senderId}&recipientId=${recipientId}`);
  }

  cancelFriendRequest(payload: FriendRequestPayload): Observable<string> {
    return this.http.request('delete', `${this.API_URL}/friend-request`, {
        body: payload,
        responseType: 'text'
    });
  }

  getNotificationsForUser(recipientId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.API_URL}/user/${recipientId}`);
  }

  getUnreadNotificationsCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/unread/count/${userId}`);
  }

  markNotificationsAsRead(userId: number): Observable<string> {
    return this.http.put(`${this.API_URL}/mark-as-read/${userId}`, {}, { responseType: 'text' });
  }

}
