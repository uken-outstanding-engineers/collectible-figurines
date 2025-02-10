import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Fandom } from './fandom.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FandomService {
  private fandoms: Fandom[] = [
    {
      id: 1,
      name: 'Star Wars',
      imageUrl: 'fandoms/star-wars.jpg',
    },
    {
      id: 2,
      name: 'Harry Potter',
      imageUrl: 'fandoms/harry-potter.jpg',
    },
    {
      id: 3,
      name: 'Marvel Universe',
      imageUrl: 'fandoms/marvel.jpg',
    },
    {
      id: 4,
      name: 'House Of The Dragon',
      imageUrl: 'fandoms/house-of-the-dragon.jpg',
    },
  ];

  // getFandoms(): Observable<Fandom[]> {
  //   return of(this.fandoms);
  // }

  private searchResults = new BehaviorSubject<Fandom[]>([]);

  private API_URL = 'http://localhost:8080/api/fandoms';

  constructor(private http: HttpClient) {}

  // Download the fandoms list
  getFandoms(): Observable<Fandom[]> {
    return this.http.get<Fandom[]>(`${this.API_URL}/all`);
  }

  // Add a fandom to the database
  addFandom(fandom: Fandom): Observable<Fandom> {
    return this.http.post<Fandom>(`${this.API_URL}/add`, fandom);
  }

  // Delete figurine
  deleteFandom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/delete/${id}`);
  }

  // Edit figurine
  editFandom(id: number, fandom: Fandom): Observable<Fandom> {
    return this.http.put<Fandom>(`${this.API_URL}/edit/${id}`, fandom);
  }
}
