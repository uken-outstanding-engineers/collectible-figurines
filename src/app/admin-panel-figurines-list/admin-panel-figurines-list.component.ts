import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; 
import { MatPaginator } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

import { Figure } from '../api/figure.model';
import { FigureService } from '../api/figure.service';

@Component({
  selector: 'app-admin-panel-figurines-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginator,
    MatMenuModule,
    FormsModule,
    //MatSort
],
  templateUrl: './admin-panel-figurines-list.component.html',
  styleUrl: './admin-panel-figurines-list.component.scss'
})
export class AdminPanelFigurinesListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; 

  figurines = new MatTableDataSource<Figure>([]);

  displayedColumns: string[] = [
    'imageUrl', 'name', 'series', 'variants', 'action',
  ];

  private subscription: Subscription;

  constructor(private figureService: FigureService) {
    this.subscription = this.figureService.getFigures().subscribe((data: Figure[]) => {
      this.figurines.data = data;
    });
  }

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

  /* Add */
  openAddDialog(): void {
    this.editFigure = {
      id: this.generateId(),
      name: '',
      series: '',
      imageUrl: 'figurines-images/000000001a.jpg',
      hoverImageUrl: 'figurines-images/000000001b.jpg',
      chase: false,
      glowInDark: false,
      flocked: false,
      exclusive: false,
    };
    this.editDialogVisible = true;
  }

  /* Edit */
  editDialogVisible = false;
  editFigure: { id: number; name: string; series: string; imageUrl: string; [key: string]: any } | null = null;

  variants = [
    { key: 'chase', label: 'Chase' },
    { key: 'glowInDark', label: 'Glow in the Dark' },
    { key: 'flocked', label: 'Flocked' },
    { key: 'exclusive', label: 'Exclusive' },
  ];

  openEditDialog(figure: { id: number; name: string; series: string; imageUrl: string; [key: string]: any }): void {
    this.editFigure = { ...figure };

    this.variants.forEach((variant) => {
      if (this.editFigure![variant.key] === undefined) {
        this.editFigure![variant.key] = false;
      }
    });

    this.editDialogVisible = true;
  }

  closeEditDialog(): void {
    this.editDialogVisible = false;
    this.editFigure = null;
  }

  /* Edit & Add */
  saveChanges(): void {
    if (this.editFigure) {
      const index = this.figurines.data.findIndex(
        (figure) => figure.id === this.editFigure?.id
      );
      if (index !== -1) {
        // Edit figurine
        this.figurines.data[index] = this.editFigure;
      } else {
        // Add new figurine
        this.editFigure['fandomId'] = 1;

        console.log(JSON.stringify(this.editFigure));
        
        this.figureService.addFigure(this.editFigure).subscribe((newFigure) => {
          this.figurines.data.push(newFigure);
          this.figurines._updateChangeSubscription();
          this.closeEditDialog();
        });
      }
      this.figurines._updateChangeSubscription();
      this.closeEditDialog();
    }
  }

  /* Delete */
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
      this.figureService.deleteFigure(this.selectedId).subscribe(
        () => {
          this.figurines.data = this.figurines.data.filter(figure => figure.id !== this.selectedId);
          this.figurines._updateChangeSubscription();
          this.closeDeleteDialog();  
          //console.log('The figurine has been removed');
        },
        (error) => {
          //console.error('Error while deleting figure', error);
        }
      );
    }
  }


  private generateId(): number {
    return this.figurines.data.length
      ? Math.max(...this.figurines.data.map((f) => f.id)) + 1
      : 1;
  }
  
}
