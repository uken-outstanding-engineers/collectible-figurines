import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Figure } from '../api/figure.model';
import { FigureService } from '../api/figure.service';

@Component({
  selector: 'app-figure',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './figure.component.html',
  styleUrl: './figure.component.scss'
})
export class FigureComponent {
  figure: Figure | undefined;
  currentImageUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private figureService: FigureService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadFigureDetails(id);
  }

  loadFigureDetails(id: number): void {
    this.figureService.getFigureById(id).subscribe((figure) => {
      if (figure) {
        this.figure = figure;
        this.currentImageUrl = figure.imageUrl;
      } else {
        console.error('Figure not found');
      }
    });
  }

  showImage(type: 'main' | 'hover'): void {
    if (this.figure) {
      this.currentImageUrl = type === 'main' ? this.figure.imageUrl : this.figure.hoverImageUrl;
    }
  }
}
