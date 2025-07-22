import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from './api-url';
import { Trade } from './trade.model';
import { ChatMessage } from './chat-message.model';

@Injectable({ providedIn: 'root' })
export class TradeService {
    private API_URL = `${API_URL.BASE_URL}/api/trades`;

    constructor(private http: HttpClient) {}

    proposeTrade(messageWithTrade: ChatMessage): Observable<ChatMessage> {
        return this.http.post<ChatMessage>(`${this.API_URL}/propose`, messageWithTrade);
    }

}
