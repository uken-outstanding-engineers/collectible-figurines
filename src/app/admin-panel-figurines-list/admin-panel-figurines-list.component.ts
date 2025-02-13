import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';

import { Figure } from '../api/figure.model';
import { FigureService } from '../api/figure.service';
import { FandomService } from '../api/fandom.service';
import { Fandom } from '../api/fandom.model';
import { API_URL } from '../api/api-url';

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
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
],
  templateUrl: './admin-panel-figurines-list.component.html',
  styleUrl: '../admin-panel/admin-panel-main.component.scss'
})
export class AdminPanelFigurinesListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  apiUrl = API_URL.BASE_URL;

  figurines = new MatTableDataSource<Figure>([]);
  fandoms: Fandom[] = []; 

  displayedColumns: string[] = [
    'imageUrl', 'name', 'series', 'variants', 'action',
  ];

  private subscription: Subscription;

  constructor(private figureService: FigureService, private fandomService: FandomService) {
    //Figurines
    this.subscription = this.figureService.getFigures().subscribe((data: Figure[]) => {
      this.figurines.data = data;
    });

    //Fandoms
    this.fandomService.getFandoms().subscribe(fandoms => {
      this.fandoms = fandoms; 
    });
  }

  ngAfterViewInit() {
    this.figurines.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.figurines.filter = filterValue;
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
      id: null,
      name: '',
      series: '',
      imageUrl: '',
      hoverImageUrl: '',
      chase: false,
      glowInDark: false,
      flocked: false,
      exclusive: false,
      fandomId: null,
    };
    this.editDialogVisible = true;
  }

  /* Edit */
  editDialogVisible = false;
  editFigure: { id: number | null; name: string; series: string; imageUrl: string; hoverImageUrl: string; [key: string]: any } | null = null;

  variants = [
    { key: 'chase', label: 'Chase' },
    { key: 'glowInDark', label: 'Glow in the Dark' },
    { key: 'flocked', label: 'Flocked' },
    { key: 'exclusive', label: 'Exclusive' },
  ];

  openEditDialog(figure: { id: number; name: string; series: string; imageUrl: string; hoverImageUrl: string; [key: string]: any }): void {
    this.editFigure = { ...figure };
    console.log(this.previewUrl);
    console.log(this.selectedFile);

    this.variants.forEach((variant) => {
      if (this.editFigure![variant.key] === undefined) {
        this.editFigure![variant.key] = false;
      }
    });

    this.editDialogVisible = true;
  }

  closeEditDialog(): void {
    this.previewUrl = null;
    this.hoverPreviewUrl = null;

    this.selectedFile = null;
    this.selectedHoverFile = null;
    
    this.editDialogVisible = false;
    this.editFigure = null;
  }

  saveChanges(): void {
    if (this.editFigure) {
      const formData = new FormData();
  
      formData.append('figurine', new Blob([JSON.stringify(this.editFigure)], { type: 'application/json' }));
  
      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile);
      }
  
      if (this.selectedHoverFile) {
        formData.append('hoverImageFile', this.selectedHoverFile);
      }
  
      if (this.editFigure.id !== null) {
        // Edit figurine
        this.figureService.editFigure(this.editFigure.id, formData).subscribe(updatedFigure => {
          const index = this.figurines.data.findIndex(f => f.id === updatedFigure.id);
          this.figurines.data[index] = updatedFigure;
          this.figurines._updateChangeSubscription();
          this.closeEditDialog();
        });
      } else {
        // Add figurine
        this.figureService.addFigure(formData).subscribe(newFigure => {
          this.figurines.data.push(newFigure);
          this.figurines._updateChangeSubscription();
          this.closeEditDialog();
        });
      }
    }
  }
  
  /* Drag and Drop */
  isDraggingNormal: boolean = false;
  isDraggingHover: boolean = false;
  previewUrl: string | ArrayBuffer | null = null;
  hoverPreviewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  selectedHoverFile: File | null = null;

  onImageSelected(event: any, type: 'normal' | 'hover'): void {
    const file = event.target.files[0];
    this.readImage(file, type);
  }
  
  // private previewImage(file: File): void {
  //   const reader = new FileReader();
  //   reader.onload = (e: any) => {
  //     if (this.editFigure) {
  //       this.editFigure.imageUrl = e.target.result; 
  //     }
  //   };
  //   reader.readAsDataURL(file);
  // }
  
  onDragOver(event: DragEvent, type: 'normal' | 'hover'): void {
    event.preventDefault();
    if (type === 'normal') {
      this.isDraggingNormal = true;
    } else {
      this.isDraggingHover = true;
    }
  }
  
  onDragLeave(event: DragEvent, type: 'normal' | 'hover'): void {
    event.preventDefault();
    if (type === 'normal') {
      this.isDraggingNormal = false;
    } else {
      this.isDraggingHover = false;
    }
  }
  
  onDrop(event: DragEvent, type: 'normal' | 'hover'): void {
    event.preventDefault();
    if (type === 'normal') {
      this.isDraggingNormal = false;
    } else {
      this.isDraggingHover = false;
    }
  
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.readImage(file, type);
    }
  }
  
  private readImage(file: File, type: 'normal' | 'hover'): void {
    if (file instanceof File) {
      if (type === 'hover') {
        this.selectedHoverFile = file;
      } else {
        this.selectedFile = file;
      }
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.editFigure) {
          if (type === 'hover') {
            this.hoverPreviewUrl = e.target?.result;
            this.editFigure.hoverImageUrl = e.target.result;
          } else {
            this.previewUrl = e.target?.result;
            this.editFigure.imageUrl = e.target.result;
          }
        }
      };
      reader.readAsDataURL(file);
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
}
