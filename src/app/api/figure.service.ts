import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { Figure } from './figure.model';
import { UserService } from './user.service';
import { API_URL } from './api-url';

@Injectable({
  providedIn: 'root',
})
export class FigureService {
  private searchResults = new BehaviorSubject<Figure[]>([]);

  private API_URL = `${API_URL.BASE_URL}/api/figurines`;

  constructor(private http: HttpClient, private userService: UserService) {}

  // Download the figurines list
  getFigures(): Observable<Figure[]> {
    return this.http.get<Figure[]>(`${this.API_URL}/all`);
  }

  // Add a figurine to the database
  addFigure(formData: FormData): Observable<Figure> {
    return this.http.post<Figure>(`${this.API_URL}/add`, formData);
  }
  
  // Delete figurine
  deleteFigure(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/delete/${id}`);
  }

  // Edit figurine
  editFigure(id: number, formData: FormData): Observable<Figure> {
    return this.http.put<Figure>(`${this.API_URL}/edit/${id}`, formData);
  }
  
  // Download the number of figurines
  getTotalFigurines(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/total`);
  }

  //Download count figure in list 
  getCountForFigurine(figurineId: number, listType: string): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/count/${figurineId}/${listType}`);
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

  getFigureById(id: number): Observable<Figure | undefined> {
    return this.getFigures().pipe(
      map((figures) => figures.find((figure) => figure.id === id))
    );
  }
}
