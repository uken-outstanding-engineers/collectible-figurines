import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { UserService } from './user.service';
import { UserFigurineLists } from './figure-list.model';
import { API_URL } from './api-url';

@Injectable({
  providedIn: 'root',
})
export class FigureListService {
  private API_URL = `${API_URL.BASE_URL}/api/figurine-lists`;

  constructor(private http: HttpClient, private userService: UserService) {}

  // Download the user's list of likes and wants
  getUserFigurineLists(userId: number): Observable<UserFigurineLists> {
    return this.http.get<UserFigurineLists>(`${this.API_URL}/figurines/${userId}`);
  }

  // Add or remove a figure from the selected list
  toggleFigurine(userId: number, figurineId: number, listName: string): Observable<string> {
    return this.http.post(`${this.API_URL}/${userId}/${listName}/${figurineId}/toggle`, {}, { responseType: 'text' });
  }
  
  
}
