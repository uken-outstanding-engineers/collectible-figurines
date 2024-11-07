import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Figure {
  imageUrl: string;
  hoverImageUrl: string;
  series: string;
  fandomId?: number;
  name: string;
  chase?: boolean;
  glowInDark?: boolean;
  flocked?: boolean;
  exclusive?: boolean;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FigureService {
  private figures: Figure[] = [
    {
      imageUrl: 'figurines-images/000000001a.jpg',
      hoverImageUrl: 'figurines-images/000000001b.jpg',
      series: 'STAR WARS',
      fandomId: 1,
      name: 'THRAWN\'S NIGHT TROOPER',
    },
    {
      imageUrl: 'figurines-images/000000002a.jpg',
      hoverImageUrl: 'figurines-images/000000002b.jpg',
      series: 'STAR WARS',
      fandomId: 1,
      name: 'PURGE TROOPER',
      exclusive: true
    },
    {
      imageUrl: 'figurines-images/000000003a.jpg',
      hoverImageUrl: 'figurines-images/000000003b.jpg',
      series: 'THE WITCHER',
      name: 'GERALT (WITH SHIELD)'
    },
    {
      imageUrl: 'figurines-images/000000004a.jpg',
      hoverImageUrl: 'figurines-images/000000004b.jpg',
      series: 'FC BARCELONA',
      name: 'ROBERT LEWANDOWSKI'
    },
    {
      imageUrl: 'figurines-images/000000005a.jpg',
      hoverImageUrl: 'figurines-images/000000005b.jpg',
      series: 'HOUSE OF THE DRAGON',
      name: 'AEMOND TARGARYEN', 
      fandomId: 4,
      chase: true
    },
    {
      imageUrl: 'figurines-images/000000006a.jpg',
      hoverImageUrl: 'figurines-images/000000006b.jpg',
      series: 'WEDNESDAY',
      name: 'WEDNESDAY ADDAMS',
    },
    {
      imageUrl: 'figurines-images/000000007a.jpg',
      hoverImageUrl: 'figurines-images/000000007b.jpg',
      series: 'EREN YEAGER',
      name: 'ATTACK ON TITAN',
    },
    {
      imageUrl: 'figurines-images/000000008a.jpg',
      hoverImageUrl: 'figurines-images/000000008b.jpg',
      series: 'SHREK',
      name: 'SHREK',
    },
    {
      imageUrl: 'figurines-images/000000009a.jpg',
      hoverImageUrl: 'figurines-images/000000009b.jpg',
      series: 'NARUTO SHIPPUDEN',
      name: 'NARUTO (SIX PATH SAGE)',
      glowInDark: true
    },
    {
      imageUrl: 'figurines-images/000000010a.jpg',
      hoverImageUrl: 'figurines-images/000000010b.jpg',
      series: 'STAR WARS',
      fandomId: 1,
      name: 'PROXY',
      glowInDark: true,
      exclusive: true
    },
    {
      imageUrl: 'figurines-images/000000011a.jpg',
      hoverImageUrl: 'figurines-images/000000011b.jpg',
      series: 'I AM GROOT',
      name: 'GROOT IN ONESIE',
    },
  ];

  private searchResults = new BehaviorSubject<Figure[]>([]);

  constructor() { }

  getFigures(): Observable<Figure[]> {
    return of(this.figures); 
  }

  getSearchResults(): Observable<Figure[]> {
    return this.searchResults.asObservable();
  }

  setSearchResults(results: Figure[]) {
    this.searchResults.next(results); 
  }

  searchFiguresByName(searchTerm: string): Observable<Figure[]> {
    return this.getFigures().pipe(
      map(figures => 
        figures.filter(figure => 
          figure.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  getFiguresByFandomId(fandomId: number): Observable<Figure[]> {
    return of(this.figures.filter(figure => figure.fandomId === fandomId));
  }

}
