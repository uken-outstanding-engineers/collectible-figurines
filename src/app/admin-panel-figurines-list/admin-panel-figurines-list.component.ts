import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; 
import { MatPaginator } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';

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
    MatButtonModule,
    MatPaginator,
    MatMenuModule
],
  templateUrl: './admin-panel-figurines-list.component.html',
  styleUrl: './admin-panel-figurines-list.component.scss'
})
export class AdminPanelFigurinesListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  figurines = new MatTableDataSource<Figure>([
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
  ]);

  displayedColumns: string[] = [
    'id', 'imageUrl', 'name', 'series', 'variants', 'action',
  ];

  ngAfterViewInit() {
    this.figurines.paginator = this.paginator;
  }

  getVariants(figure: Figure): string[] {
    const variants = [];
    if (figure.chase) variants.push('Chase');
    if (figure.glowInDark) variants.push('Glow In Dark');
    if (figure.flocked) variants.push('Flocked');
    if (figure.exclusive) variants.push('Exclusive');
    return variants;
  }

  onEdit(figure: Figure): void {
    console.log('Edit action triggered for:', figure);
  }
  
  dialogVisible = false;
  selectedId: number | null = null;
  selectedName: string | null = null; 

  openDeleteDialog(id: number, name: string): void {
    this.selectedId = id;
    this.selectedName = name;
    this.dialogVisible = true;
  }

  closeDeleteDialog(): void {
    this.dialogVisible = false;
    this.selectedId = null;
    this.selectedName = null;
  }

  confirmDelete(): void {
    if (this.selectedId !== null) {
      this.figurines.data = this.figurines.data.filter(figure => figure.id !== this.selectedId);
      this.figurines._updateChangeSubscription();
      this.closeDeleteDialog();
    }
  }
}
