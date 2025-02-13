import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { Figure } from '../api/figure.model';
import { FigureService } from '../api/figure.service';
import { API_URL } from '../api/api-url';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {
  apiUrl = API_URL.BASE_URL;
  
  searchResults$!: Observable<Figure[]>; 
  hoverTimeouts: { [key: string]: any } = {};

  constructor(private figureService: FigureService) {}

  ngOnInit(): void {
    this.searchResults$ = this.figureService.getSearchResults();
  }

  toggleActive(figure: Figure): void {
    //figure.isActive = !figure.isActive;
  }

    /* Mouse over on figure picture */
    onMouseOver(figure: Figure, event: Event): void {
      const element = event.target as HTMLImageElement;
      this.hoverTimeouts[figure.name] = setTimeout(() => {
        element.style.transition = 'opacity 0.5s ease-in-out';
        element.style.opacity = '0';
        setTimeout(() => {
          element.src = this.apiUrl + figure.hoverImageUrl;
          element.style.opacity = '1';
        }, 250);
      }, 250);
    }
  
    /* Mouse out on figure picture */
    onMouseOut(figure: Figure, event: Event): void {
      const element = event.target as HTMLImageElement;
      clearTimeout(this.hoverTimeouts[figure.name]);
      element.style.transition = 'opacity 0.5s ease-in-out';
      element.style.opacity = '0';
      setTimeout(() => {
        element.src = this.apiUrl + figure.imageUrl;
        element.style.opacity = '1';
      }, 250);
    }

}
