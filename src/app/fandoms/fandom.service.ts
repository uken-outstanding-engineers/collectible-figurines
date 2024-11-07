// fandom.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Fandom } from './fandom.model';

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

  getFandoms(): Observable<Fandom[]> {
    return of(this.fandoms);
  }
}
