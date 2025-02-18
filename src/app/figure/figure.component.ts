import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Figure } from '../api/figure.model';
import { FigureService } from '../api/figure.service';
import { API_URL } from '../api/api-url';

@Component({
  selector: 'app-figure',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './figure.component.html',
  styleUrl: './figure.component.scss'
})
export class FigureComponent {
  apiUrl = API_URL.BASE_URL;
  
  figure: Figure | undefined;
  currentImageUrl: string = '';
  recommendedFigures: Figure[] = [];

  constructor(
    private route: ActivatedRoute,
    private figureService: FigureService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.loadFigureDetails(id);
    });

    this.figureService.getFigures().subscribe((figures) => {
      this.recommendedFigures = figures.slice(0, 12); //ulepszyć
      this.calculateFiguresPerPage();
    });

    window.scrollTo(0, 0);
  }

  loadFigureDetails(id: number): void {
    this.figureService.getFigureById(id).subscribe((figure) => {
      if (figure) {
        this.figure = figure;
        this.currentImageUrl = this.apiUrl + figure.imageUrl;
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

  // recommendedFigures: Figure[] = [
  //   { id: 1, name: 'PURGE TROOPER', series: 'STAR WARS', imageUrl: '/api/images/figurines-images/f6857da8-a4a1-4af9-a7c1-2f5607ca4549_000000002a.jpg', hoverImageUrl: 'purge-trooper-hover.jpg', number: 10 },
  //   { id: 2, name: "THRAWN'S NIGHT TROOPER", series: 'STAR WARS', imageUrl: '/api/images/figurines-images/2377bd1d-e1a9-4051-a760-40f8ef8b9573_000000001a.jpg', hoverImageUrl: 'thrawn-night-trooper-hover.jpg', number: 10 },
  //   { id: 3, name: 'GERALT (WITH SHIELD)', series: 'THE WITCHER', imageUrl: '/api/images/figurines-images/93c727e8-c9fd-4991-8bc8-6b41bfdb92fc_000000003a.jpg', hoverImageUrl: 'geralt-hover.jpg', number: 10 },
  //   { id: 4, name: 'ROBERT LEWANDOWSKI', series: 'FC BARCELONA', imageUrl: '/api/images/figurines-images/e4f5852e-9dc7-4552-9a3b-5daf9d54fa8d_000000004a.jpg', hoverImageUrl: 'lewandowski-hover.jpg', number: 10 },
  //   { id: 5, name: 'AEMOND TARGARYEN', series: 'HOUSE OF THE DRAGON', imageUrl: '/api/images/figurines-images/be7af699-6451-440e-aadf-53f6045a7c34_000000005a.jpg', hoverImageUrl: 'aemond-hover.jpg', number: 10 },
  //   { id: 6, name: 'WEDNESDAY ADDAMS', series: 'WEDNESDAY', imageUrl: '/api/images/figurines-images/da6648f2-479b-4516-96e3-3309721cd0e5_000000006a.jpg', hoverImageUrl: 'wednesday-hover.jpg', number: 10 },
  //   { id: 7, name: 'EREN YEAGER', series: 'ATTACK ON TITAN', imageUrl: '/api/images/figurines-images/0f0d56d7-0163-4fb5-83ca-20269b04006e_000000007a.jpg', hoverImageUrl: 'eren-hover.jpg', number: 10 },
  //   { id: 8, name: 'SHREK', series: 'SHREK', imageUrl: '/api/images/figurines-images/c73153dc-e5e6-4e28-a774-2c7268177710_000000008a.jpg', hoverImageUrl: 'shrek-hover.jpg', number: 10 },
  //   { id: 9, name: 'NARUTO (SIX PATH SAGE)', series: 'NARUTO SHIPPUDEN', imageUrl: '/api/images/figurines-images/dd4c6681-f5cd-4245-b0ba-ddfde8ed665f_000000009a.jpg', hoverImageUrl: 'naruto-hover.jpg', number: 10 },
  //   { id: 10, name: 'PROXY', series: 'STAR WARS', imageUrl: '/api/images/figurines-images/16bcf9ab-0057-414b-87d0-569863f237ad_000000010a.jpg', hoverImageUrl: 'proxy-hover.jpg', number: 10 },
  //   { id: 11, name: 'GROOT IN ONESIE', series: 'I AM GROOT', imageUrl: '/api/images/figurines-images/8a9e2510-4558-4b8c-844c-d9df01ce70b4_000000011a.jpg', hoverImageUrl: 'groot-hover.jpg', number: 10 },
  //   { id: 12, name: 'hello', series: 'world', imageUrl: '/api/images/figurines-images/9a34f26c-0ba8-45c1-bce4-5cdcb6e1d31f_000000001a.jpg', hoverImageUrl: 'hello-hover.jpg', number: 10 }
  // ];
  

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
