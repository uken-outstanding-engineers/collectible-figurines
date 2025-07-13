import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from './api-url';

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
}
