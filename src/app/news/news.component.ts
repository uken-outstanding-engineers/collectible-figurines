import { Component, OnInit } from '@angular/core';
import { FigureService, Figure } from '../figures-showcase/figure.service';
import { map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
    
  ],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  public figures: Figure[] = [];
  public displayedFigures: Figure[] = [];

  constructor(private figureService: FigureService) {}

  ngOnInit(): void {
    this.loadFigures();
  }

  loadFigures() {
    this.figureService.getFigures().subscribe((allFigures) => {
      this.figures = allFigures;
      // Wyświetl tylko ostatnie 5 figurek
      this.displayedFigures = this.figures.slice(-4);  // Pobieramy ostatnie 5 elementów
    });
  }

  hoverTimeouts: { [key: string]: any } = {};

  /* Mouse over on figure picture */
  onMouseOver(figure: Figure, event: Event): void {
    const element = event.target as HTMLImageElement;
    this.hoverTimeouts[figure.name] = setTimeout(() => {
      element.style.transition = 'opacity 0.5s ease-in-out';
      element.style.opacity = '0';
      setTimeout(() => {
        element.src = figure.hoverImageUrl;
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
      element.src = figure.imageUrl;
      element.style.opacity = '1';
    }, 250);
  }

  toggleActive(figure: Figure): void {
    figure.isActive = !figure.isActive;
  }

}
