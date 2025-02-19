import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Figure } from '../api/figure.model';
import { FigureService } from '../api/figure.service';
import { FigureListService } from '../api/figure-list.service';
import { API_URL } from '../api/api-url';
import { UserService } from '../api/user.service';
import { toggleListActiveFigurine } from '../services/figurine-status.service';

@Component({
  selector: 'app-figure',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule, 
    RouterModule
  ],
  templateUrl: './figure.component.html',
  styleUrl: './figure.component.scss'
})
export class FigureComponent {
  apiUrl = API_URL.BASE_URL;
  
  userId: number | null = null;

  figure: Figure | undefined;
  currentImageUrl: string = '';
  recommendedFigures: Figure[] = [];

  statsCounts: Record<string, number> = {
    Liked: 0,
    Wanted: 0,
    Owned: 0
  };


  constructor(
    private route: ActivatedRoute,
    private figureService: FigureService,
    private userService: UserService,
    private figureListService: FigureListService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.loadFigureDetails(id);
      window.scrollTo(0, 0);
    });

    this.figureService.getFigures().subscribe((figures) => {
      this.recommendedFigures = figures.slice(0, 12); //ulepszyć
      this.calculateFiguresPerPage();
    });

    this.userService.getLoggedInUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
      }
    });

    this.loadFigurePropertiesForSingle(1, ['isLiked', 'isWanted', 'isOwned'], ['liked', 'wanted', 'owned']);
    // loadFiguresPropertyFigurine(this.userId, this.figureListService, this.figures, 'isLiked', 'liked');
    // loadFiguresPropertyFigurine(this.userId, this.figureListService, this.figures, 'isWanted', 'wanted');
    // loadFiguresPropertyFigurine(this.userId, this.figureListService, this.figures, 'isOwned', 'owned');
  }

  loadFigureDetails(id: number): void {
    this.figureService.getFigureById(id).subscribe((figure) => {
      if (figure) {
        this.figure = figure;
        this.currentImageUrl = this.apiUrl + figure.imageUrl;

        this.loadStatistics();
      } else {
        console.error('Figure not found');
      }
    });
  }

  showImage(type: 'main' | 'hover'): void {
    if (this.figure) {
      this.currentImageUrl = type === 'main' ? this.apiUrl + this.figure.imageUrl : this.apiUrl + this.figure.hoverImageUrl;
    }
  }

  toggleListActive(figure: Figure, listName: string): void {
    toggleListActiveFigurine(figure, this.userId, listName, this.figureListService);

    if (this.statsCounts) {
      const propertyName = `is${listName}` as keyof Figure;

      this.statsCounts[listName] += !figure[propertyName] ? 1 : -1;

      if (listName === 'Owned' && figure.isWanted) {
        this.statsCounts['Wanted'] -= 1;
        figure.isWanted = false;
      } else if (listName === 'Wanted' && figure.isOwned) {
        this.statsCounts['Owned'] -= 1;
        figure.isOwned = false;
      }
    }
  }


  loadFigurePropertiesForSingle(figureId: number, properties: string[], listKeys: string[]): void {
    if (!this.userId) return;
  
    this.figureListService.getUserFigurineLists(this.userId).subscribe(lists => {
      properties.forEach((property, index) => {
        const listKey = listKeys[index];
        if (lists[listKey]) {
          const figureIds = lists[listKey].map(figurine => figurine.id).filter(id => id !== null) as number[];
  
          const figure = this.figure;
          if (figure && figure.id !== null) {
            figure[property] = figureIds.includes(figure.id);
          }
        }
      });
    });
  }


  loadStatistics(): void {
    if (!this.figure?.id) return;

    ['Liked', 'Wanted', 'Owned'].forEach(type => {
      if(this.figure?.id) {
        this.figureService.getCountForFigurine(this.figure?.id, type.toUpperCase()).subscribe((count) => {
          if (this.statsCounts) {
            this.statsCounts[type] = count;
          }
        });
      }
    });
  }

  // Recommended figurines
  @ViewChild('cardsWrapper', { static: false }) cardsWrapper!: ElementRef;

  visibleFigures: Figure[] = [];
  dots: number[] = [];
  activeDotIndex = 0;
  figuresPerPage = 2;

  ngAfterViewInit(): void {
    this.calculateFiguresPerPage();
    setTimeout(() => this.setActiveFigures(), 0);
    window.addEventListener('resize', () => this.calculateFiguresPerPage());
  }

  @HostListener('window:resize', [])
  calculateFiguresPerPage() {
    if (!this.cardsWrapper) return;
  
    const containerWidth = this.cardsWrapper.nativeElement.clientWidth;
    const figureWidth = 240;
    const minFigures = 2;
  
    this.figuresPerPage = Math.max(minFigures, Math.floor(containerWidth / figureWidth));
  
    const totalPages = Math.ceil(this.recommendedFigures.length / this.figuresPerPage);
    this.dots = Array.from({ length: totalPages }, (_, i) => i);
  
    this.activeDotIndex = 0;
    this.setActiveFigures();
  }

  setActiveFigures() {
    const start = this.activeDotIndex * this.figuresPerPage;
    this.visibleFigures = this.recommendedFigures.slice(start, start + this.figuresPerPage);
  }

  scrollLeft() {
    if (this.activeDotIndex > 0) {
      this.activeDotIndex--;
      this.setActiveFigures();
    }
  }

  scrollRight() {
    const maxIndex = Math.ceil(this.recommendedFigures.length / this.figuresPerPage) - 1;
    if (this.activeDotIndex < maxIndex) {
      this.activeDotIndex++;
      this.setActiveFigures();
    }
  }

  scrollToIndex(index: number) {
    this.activeDotIndex = index;
    this.setActiveFigures();
  }
}
