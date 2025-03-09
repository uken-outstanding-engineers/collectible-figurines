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
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox'

import { Figure } from '../api/figure.model';
import { FigureService } from '../api/figure.service';
import { FandomService } from '../api/fandom.service';
import { Fandom } from '../api/fandom.model';
import { API_URL } from '../api/api-url';
import { AdminPanelService } from '../services/admin-panel.service';
import { SnackbarService } from '../services/snackbar.service';
import { TranslationService } from '../services/translation.service';
import { transition } from '@angular/animations';

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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule
],
  templateUrl: './admin-panel-figurines-list.component.html',
  styleUrl: '../admin-panel/admin-panel-main.component.scss'
})
export class AdminPanelFigurinesListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  apiUrl = API_URL.BASE_URL;
  translatedTexts: Record<string, any> = {};

  figurines = new MatTableDataSource<Figure>([]);
  fandoms: Fandom[] = []; 

  isSeriesFandomSame: boolean = false;
  fandomValue: string = '';  

  displayedColumns: string[] = [
    'imageUrl', 'name', 'series', 'number', 'variants', 'action',
  ];

  private subscription: Subscription;

  constructor(
    private figureService: FigureService, 
    private fandomService: FandomService,
    private adminPanelService: AdminPanelService,
    private snackBarService: SnackbarService,
    private translationService: TranslationService,
  ) {
    //Figurines
    this.subscription = this.figureService.getFigures().subscribe((data: Figure[]) => {
      this.figurines.data = data;
    });

    //Fandoms
    this.fandomService.getFandoms().subscribe(fandoms => {
      this.fandoms = fandoms; 
    });

    this.translationService.translations$.subscribe(translations => {
      this.translatedTexts = translations?.['admin_panel']?.['figurines_list_page'] || {};
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
      number: null,
      imageUrl: '',
      hoverImageUrl: '',
      chase: false,
      glowInDark: false,
      flocked: false,
      exclusive: false,
      fandomId: null,
    };
    this.adminPanelService.openDialog();
    this.editDialogVisible = true;
  }

  /* Edit */
  editDialogVisible = false;
  editFigure: { 
    id: number | null;
    name: string;  
    series: string; 
    number: number | null;
    imageUrl: string; 
    hoverImageUrl: string; 
    [key: string]: any 
  } | null = null;
  
  variants = [
    { key: 'chase', label: 'Chase' },
    { key: 'glowInDark', label: 'Glow in the Dark' },
    { key: 'flocked', label: 'Flocked' },
    { key: 'exclusive', label: 'Exclusive' },
  ];

  openEditDialog(figure: { 
    id: number; 
    name: string; 
    series: string; 
    number: number | null;
    imageUrl: string; 
    hoverImageUrl: string; 
    [key: string]: any 
  }): void {
    this.editFigure = { ...figure };
    
    this.variants.forEach((variant) => {
      if (this.editFigure![variant.key] === undefined) {
        this.editFigure![variant.key] = false;
      }
    });

    this.adminPanelService.openDialog();
    this.editDialogVisible = true;
  }

  closeEditDialog(): void {
    this.previewUrl = null;
    this.hoverPreviewUrl = null;

    this.selectedFile = null;
    this.selectedHoverFile = null;
    
    this.editDialogVisible = false;
    this.editFigure = null;

    this.isSeriesFandomSame = false;

    this.adminPanelService.closeDialog();
  }

  saveChanges(): void {
    if (this.editFigure) {
      const formData = new FormData();
      this.editFigure.name = this.editFigure.name.trim().toUpperCase();
      this.editFigure.series = this.editFigure.series.trim().toUpperCase();
  
      formData.append('figurine', new Blob([JSON.stringify(this.editFigure)], { type: 'application/json' }));
  
      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile);
      }
  
      if (this.selectedHoverFile) {
        formData.append('hoverImageFile', this.selectedHoverFile);
      }

      const requiredFields = [
        this.editFigure.imageUrl,
        this.editFigure.hoverImageUrl,
        this.editFigure.name,
        this.editFigure.series
      ];
      
      if (requiredFields.some(field => !field)) {
        this.snackBarService.showError(this.translatedTexts["snackBarMessages"]["emptyFieldsError"]);
        return;
      }
      
      if (this.editFigure.id !== null) {
        // Edit figurine
        this.figureService.editFigure(this.editFigure.id, formData).subscribe(
          updatedFigure => {
            const index = this.figurines.data.findIndex(f => f.id === updatedFigure.id);
            this.figurines.data[index] = updatedFigure;
            this.figurines._updateChangeSubscription();
            this.snackBarService.showSuccess(this.translatedTexts["snackBarMessages"]["figurineUpdatedSuccess"]);
            this.closeEditDialog();
          },
          error => {
            this.snackBarService.showError(this.translatedTexts["snackBarMessages"]["unexpectedError"]);
          }
      );
      } else {
        // Add figurine
        this.figureService.addFigure(formData).subscribe(
          newFigure => {
            this.figurines.data.unshift(newFigure);
            this.figurines._updateChangeSubscription();
            this.closeEditDialog();
            this.snackBarService.showSuccess(this.translatedTexts["snackBarMessages"]["figurineAddedSuccess"]);
          },
          error => {
            this.snackBarService.showError(this.translatedTexts["snackBarMessages"]["unexpectedError"]);
          }
        );
      }
    }
  }

  onCheckboxChange() {
    if (this.editFigure) {
      if (this.isSeriesFandomSame) {
        const fandomId = this.editFigure["fandomId"];
        const fandom = this.fandoms.find(f => f.id === fandomId);
        if(fandom)
          this.editFigure['series'] = fandom.name.toUpperCase();
      } 
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
     this.adminPanelService.openDialog();
   }
 
   closeDeleteDialog(): void {
     this.dialogVisible = false;
     this.selectedId = null;
     this.selectedName = null;
     this.adminPanelService.closeDialog();
   }
 
   confirmDelete(): void {
    const id: number | null = this.selectedId;
    if (id !== null) {
      this.figureService.deleteFigure(id).subscribe(
        () => {
          const index = this.figurines.data.findIndex(figure => figure.id === id);

          if (index !== -1) {
            this.figurines.data.splice(index, 1); 
            this.figurines._updateChangeSubscription();
          }
  
          this.snackBarService.showSuccess(this.translatedTexts["snackBarMessages"]["figurineDeletedSuccess"]);
        },
        (error) => {
          this.snackBarService.showError(this.translatedTexts["snackBarMessages"]["unexpectedError"]);
        }
      );
    }
    this.closeDeleteDialog();
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
    const MAX_SIZE_MB = 1024;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * MAX_SIZE_MB;
    
    if (file instanceof File) {

      if (file.size > MAX_SIZE_BYTES) {
        this.snackBarService.showError(this.translatedTexts["snackBarMessages"]["fileTooLarge"] + ` ${MAX_SIZE_MB / 1024}MB.`);
        return;
      }

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
}
