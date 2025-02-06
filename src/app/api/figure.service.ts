import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Figure } from './figure.model';

@Injectable({
  providedIn: 'root',
})
export class FigureService {
  // private figures: Figure[] = [
  //   {
  //       id: 1,
  //       imageUrl: 'figurines-images/000000001a.jpg',
  //       hoverImageUrl: 'figurines-images/000000001b.jpg',
  //       series: 'STAR WARS',
  //       fandomId: 1,
  //       name: 'THRAWN\'S NIGHT TROOPER',
  //   },
  //   {
  //       id: 2,
  //       imageUrl: 'figurines-images/000000002a.jpg',
  //       hoverImageUrl: 'figurines-images/000000002b.jpg',
  //       series: 'STAR WARS',
  //       fandomId: 1,
  //       name: 'PURGE TROOPER',
  //       exclusive: true,
  //   },
  //   {
  //       id: 3,
  //       imageUrl: 'figurines-images/000000003a.jpg',
  //       hoverImageUrl: 'figurines-images/000000003b.jpg',
  //       series: 'THE WITCHER',
  //       name: 'GERALT (WITH SHIELD)',
  //   },
  //   {
  //       id: 4,
  //       imageUrl: 'figurines-images/000000004a.jpg',
  //       hoverImageUrl: 'figurines-images/000000004b.jpg',
  //       series: 'FC BARCELONA',
  //       name: 'ROBERT LEWANDOWSKI',
  //   },
  //   {
  //       id: 5,
  //       imageUrl: 'figurines-images/000000005a.jpg',
  //       hoverImageUrl: 'figurines-images/000000005b.jpg',
  //       series: 'HOUSE OF THE DRAGON',
  //       name: 'AEMOND TARGARYEN',
  //       fandomId: 4,
  //       chase: true,
  //   },
  //   {
  //       id: 6,
  //       imageUrl: 'figurines-images/000000006a.jpg',
  //       hoverImageUrl: 'figurines-images/000000006b.jpg',
  //       series: 'WEDNESDAY',
  //       name: 'WEDNESDAY ADDAMS',
  //   },
  //   {
  //       id: 7,
  //       imageUrl: 'figurines-images/000000007a.jpg',
  //       hoverImageUrl: 'figurines-images/000000007b.jpg',
  //       series: 'EREN YEAGER',
  //       name: 'ATTACK ON TITAN',
  //   },
  //   {
  //       id: 8,
  //       imageUrl: 'figurines-images/000000008a.jpg',
  //       hoverImageUrl: 'figurines-images/000000008b.jpg',
  //       series: 'SHREK',
  //       name: 'SHREK',
  //   },
  //   {
  //       id: 9,
  //       imageUrl: 'figurines-images/000000009a.jpg',
  //       hoverImageUrl: 'figurines-images/000000009b.jpg',
  //       series: 'NARUTO SHIPPUDEN',
  //       name: 'NARUTO (SIX PATH SAGE)',
  //       glowInDark: true
  //   },
  //   {
  //       id: 10,
  //       imageUrl: 'figurines-images/000000010a.jpg',
  //       hoverImageUrl: 'figurines-images/000000010b.jpg',
  //       series: 'STAR WARS',
  //       fandomId: 1,
  //       name: 'PROXY',
  //       glowInDark: true,
  //       exclusive: true
  //   },
  //   {
  //       id: 11,
  //       imageUrl: 'figurines-images/000000011a.jpg',
  //       hoverImageUrl: 'figurines-images/000000011b.jpg',
  //       series: 'I AM GROOT',
  //       name: 'GROOT IN ONESIE',
  //   },
  // ];

  private searchResults = new BehaviorSubject<Figure[]>([]);

  private API_URL = 'http://localhost:8080/api/figurines';

  constructor(private http: HttpClient) {}

  // Download the figurines list
  getFigures(): Observable<Figure[]> {
    return this.http.get<Figure[]>(`${this.API_URL}/all`);
  }

  // Add a figurine to the database
  addFigure(figure: Figure): Observable<Figure> {
    return this.http.post<Figure>(`${this.API_URL}/add`, figure);
  }

  // Delete figurine
  deleteFigure(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/delete/${id}`);
  }

  // Edit figurine
  editFigure(id: number, figure: Figure): Observable<Figure> {
    return this.http.put<Figure>(`${this.API_URL}/edit/${id}`, figure);
  }

  // Download the number of figurines
  getTotalFigurines(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/total`);
  }

  getSearchResults(): Observable<Figure[]> {
    return this.searchResults.asObservable();
  }

  setSearchResults(results: Figure[]) {
    this.searchResults.next(results); 
  }

  searchFiguresByNameOrSeries(term: string): Observable<Figure[]> {
    const lowerCaseTerm = term.toLowerCase();
    return this.getFigures().pipe(
      map((figures) =>
        figures.filter(
          (figure) =>
            figure.name.toLowerCase().includes(lowerCaseTerm) ||
            figure.series.toLowerCase().includes(lowerCaseTerm)
        )
      )
    );
  }

  //getFiguresByFandomId(fandomId: number): Observable<Figure[]> {
    //return of(this.figures.filter(figure => figure.fandomId === fandomId));
  //}

  getFigureById(id: number): Observable<Figure | undefined> {
    return this.getFigures().pipe(
      map((figures) => figures.find((figure) => figure.id === id))
    );
  }
}
