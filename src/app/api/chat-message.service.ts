import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessage, PublicUser } from './chat-message.model';

import { API_URL } from './api-url';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
    private API_URL = `${API_URL.BASE_URL}/api/messages`;

    private selectedUser: PublicUser | null = null;

    constructor(private http: HttpClient) {}

    getChatContacts(userId: number): Observable<PublicUser[]> {
        return this.http.get<PublicUser[]>(`${this.API_URL}/contacts?userId=${userId}`);
    }

    getMessagesBetweenUsers(userId1: number, userId2: number): Observable<ChatMessage[]> {
        return this.http.get<ChatMessage[]>(`${this.API_URL}/conversation?userId1=${userId1}&userId2=${userId2}`);
    }

    sendMessage(message: ChatMessage): Observable<ChatMessage> {
        return this.http.post<ChatMessage>(`${this.API_URL}/send`, message);
    }

    setSelectedUser(user: PublicUser) {
        this.selectedUser = user;
    }

    getSelectedUser(): PublicUser | null {
        return this.selectedUser;
    }

    clear() {
        this.selectedUser = null;
    }
}
