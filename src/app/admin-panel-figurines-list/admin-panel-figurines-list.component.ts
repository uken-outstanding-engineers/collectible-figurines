import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; 

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
}

@Component({
  selector: 'app-admin-panel-figurines-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './admin-panel-figurines-list.component.html',
  styleUrl: './admin-panel-figurines-list.component.scss'
})
export class AdminPanelFigurinesListComponent {
  figurines: Figure[] = [
    {
      id: 1,
      imageUrl: 'https://example.com/figurine1.jpg',
      hoverImageUrl: 'https://example.com/figurine1-hover.jpg',
      series: 'Series 1',
      name: 'Figurine 1',
      chase: true,
      glowInDark: false,
      flocked: true,
      exclusive: false,
    },
    {
      id: 2,
      imageUrl: 'https://example.com/figurine2.jpg',
      hoverImageUrl: 'https://example.com/figurine2-hover.jpg',
      series: 'Series 2',
      name: 'Figurine 2',
      chase: false,
      glowInDark: true,
      flocked: false,
      exclusive: true,
    },
  ];

  displayedColumns: string[] = [
    'id', 'imageUrl', 'name', 'series', 'chase', 'glowInDark', 'flocked', 'exclusive',
  ];
}
