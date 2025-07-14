import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from './api-url';

@Injectable({
  providedIn: 'root',
})
export class FriendshipsService {
  private API_URL = `${API_URL.BASE_URL}/api/friendships`;

  constructor(private http: HttpClient) {}

  acceptFriendRequest(payload: { userId1: number, userId2: number }) {
    return this.http.post(`${this.API_URL}/add`, payload, { responseType: 'text' });
  }

}
