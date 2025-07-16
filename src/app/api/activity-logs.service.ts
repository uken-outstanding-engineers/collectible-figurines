// activity-logs.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityLog } from './activity-logs.model';
import { API_URL } from './api-url';

@Injectable({
  providedIn: 'root',
})
export class ActivityLogsService {
    private API_URL = `${API_URL.BASE_URL}/api/activity-logs`;

    constructor(private http: HttpClient) {}

    getAllLogs(): Observable<ActivityLog[]> {
        return this.http.get<ActivityLog[]>(`${this.API_URL}/all`);
    }
}
