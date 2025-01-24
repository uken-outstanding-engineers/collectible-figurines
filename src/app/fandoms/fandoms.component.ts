import { Component } from '@angular/core';
import { FandomService } from '../api/fandom.service';
import { Fandom } from '../api/fandom.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin, map } from 'rxjs';

import { Figure } from '../api/figure.model';
import { FigureService } from '../api/figure.service';

@Component({
  selector: 'app-fandoms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fandoms.component.html',
  styleUrl: './fandoms.component.scss'
})
export class FandomsComponent {
  fandoms: Fandom[] = [];
  filteredFandoms: Fandom[] = [];

  constructor(
    private fandomService: FandomService, 
    private figureService: FigureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fandomService.getFandoms().subscribe(fandoms => {
      const fandomsWithFigures$ = fandoms.map(fandom =>
        this.figureService.getFiguresByFandomId(fandom.id).pipe(
          map((figures: Figure[]) => ({
            fandom,
            hasFigures: figures.length > 0
          }))
        )
      );

      forkJoin(fandomsWithFigures$).subscribe(results => {
        this.filteredFandoms = results
          .filter(result => result.hasFigures)
          .map(result => result.fandom);
      });
    });
  }

  onFandomClick(fandomId: number): void {
    this.router.navigate(['/figures-showcase'], { queryParams: { fandomId } });
  }
}
