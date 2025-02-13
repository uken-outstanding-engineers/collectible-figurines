import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Fandom } from './fandom.model';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api-url';

@Injectable({
  providedIn: 'root'
})
export class FandomService {
  private searchResults = new BehaviorSubject<Fandom[]>([]);

  private API_URL = `${API_URL.BASE_URL}/api/fandoms`;

  constructor(private http: HttpClient) {}

  // Download the fandoms list
  getFandoms(): Observable<Fandom[]> {
    return this.http.get<Fandom[]>(`${this.API_URL}/all`);
  }

  // Add a fandom to the database
  addFandom(formData: FormData): Observable<Fandom> {
    return this.http.post<Fandom>(`${this.API_URL}/add`, formData);
  }

  // Delete figurine
  deleteFandom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/delete/${id}`);
  }

  // Edit figurine
  editFandom(id: number, formData: FormData): Observable<Fandom> {
    return this.http.put<Fandom>(`${this.API_URL}/edit/${id}`, formData);
  }
}
