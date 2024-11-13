import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Figure {
  id: number;
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
      id: 1,
      imageUrl: 'figurines-images/000000001a.jpg',
      hoverImageUrl: 'figurines-images/000000001b.jpg',
      series: 'STAR WARS',
      fandomId: 1,
      name: 'THRAWN\'S NIGHT TROOPER',
    },
    {
      id: 2,
      imageUrl: 'figurines-images/000000002a.jpg',
      hoverImageUrl: 'figurines-images/000000002b.jpg',
      series: 'STAR WARS',
      fandomId: 1,
      name: 'PURGE TROOPER',
      exclusive: true
    },
    {
      id: 3,
      imageUrl: 'figurines-images/000000003a.jpg',
      hoverImageUrl: 'figurines-images/000000003b.jpg',
      series: 'THE WITCHER',
      name: 'GERALT (WITH SHIELD)'
    },
    {
      id: 4,
      imageUrl: 'figurines-images/000000004a.jpg',
      hoverImageUrl: 'figurines-images/000000004b.jpg',
      series: 'FC BARCELONA',
      name: 'ROBERT LEWANDOWSKI'
    },
    {
      id: 5,
      imageUrl: 'figurines-images/000000005a.jpg',
      hoverImageUrl: 'figurines-images/000000005b.jpg',
      series: 'HOUSE OF THE DRAGON',
      name: 'AEMOND TARGARYEN', 
      fandomId: 4,
      chase: true
    },
    {
      id: 6,
      imageUrl: 'figurines-images/000000006a.jpg',
      hoverImageUrl: 'figurines-images/000000006b.jpg',
      series: 'WEDNESDAY',
      name: 'WEDNESDAY ADDAMS',
    },
    {
      id: 7,
      imageUrl: 'figurines-images/000000007a.jpg',
      hoverImageUrl: 'figurines-images/000000007b.jpg',
      series: 'EREN YEAGER',
      name: 'ATTACK ON TITAN',
    },
    {
      id: 8,
      imageUrl: 'figurines-images/000000008a.jpg',
      hoverImageUrl: 'figurines-images/000000008b.jpg',
      series: 'SHREK',
      name: 'SHREK',
    },
    {
      id: 9,
      imageUrl: 'figurines-images/000000009a.jpg',
      hoverImageUrl: 'figurines-images/000000009b.jpg',
      series: 'NARUTO SHIPPUDEN',
      name: 'NARUTO (SIX PATH SAGE)',
      glowInDark: true
    },
    {
      id: 10,
      imageUrl: 'figurines-images/000000010a.jpg',
      hoverImageUrl: 'figurines-images/000000010b.jpg',
      series: 'STAR WARS',
      fandomId: 1,
      name: 'PROXY',
      glowInDark: true,
      exclusive: true
    },
    {
      id: 11,
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

  searchFiguresByNameOrSeries(term: string): Observable<Figure[]> {
    const lowerCaseTerm = term.toLowerCase();
    const filteredFigures = this.figures.filter(
      (figure) =>
        figure.name.toLowerCase().includes(lowerCaseTerm) ||
        figure.series.toLowerCase().includes(lowerCaseTerm)
    );
    return of(filteredFigures);
  }

  getFiguresByFandomId(fandomId: number): Observable<Figure[]> {
    return of(this.figures.filter(figure => figure.fandomId === fandomId));
  }

  getFigureById(id: number): Observable<Figure | undefined> {
    return of(this.figures.find(figure => figure.id === id));
  }
  
}
