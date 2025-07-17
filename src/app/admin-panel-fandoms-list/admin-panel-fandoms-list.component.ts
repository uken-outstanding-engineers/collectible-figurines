import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms'; 
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button'; 
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';

import { Fandom } from '../api/fandom.model';
import { FandomService } from '../api/fandom.service';
import { API_URL } from '../api/api-url';
import { AdminPanelService } from '../services/admin-panel.service';
import { SnackbarService } from '../services/snackbar.service';
import { TranslationService } from '../services/translation.service';
import { UserService } from '../api/user.service';

@Component({
  selector: 'app-admin-panel-fandoms-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './admin-panel-fandoms-list.component.html',
  styleUrl: '../admin-panel/admin-panel-main.component.scss'
})
export class AdminPanelFandomsListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  apiUrl = API_URL.BASE_URL;
  translatedTexts: Record<string, any> = {};
  
  fandoms = new MatTableDataSource<Fandom>([]);

  displayedColumns: string[] = [
    'imageUrl', 'name', 'action'
  ];

  private subscription: Subscription;

  constructor(
    private fandomService: FandomService,
    private adminPanelService: AdminPanelService,
    private snackBarService: SnackbarService,
    private translationService: TranslationService,
    private userService: UserService,
  ) {
    this.subscription = this.fandomService.getFandoms().subscribe((data: Fandom[]) => {
      this.fandoms.data = data;
    });

    this.translationService.translations$.subscribe(translations => {
      this.translatedTexts = translations?.['admin_panel']?.['fandoms_list_page'] || {};
      console.log(this.translatedTexts);
    });
  }

  ngAfterViewInit() {
    this.fandoms.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.fandoms.filter = filterValue;
  }

  /* Add */
  openAddDialog(): void {
    this.editFandom = {
      id: null,
      name: '',
      imageUrl: '',
    };
    this.adminPanelService.openDialog();
    this.editDialogVisible = true;
  }

  /* Edit */
  editDialogVisible = false;
  editFandom: { id: number | null; name: string; imageUrl: string;} | null = null;

  openEditDialog(fandom: { id: number; name: string; imageUrl: string; }): void {
    this.editFandom = { ...fandom };
    
    this.adminPanelService.openDialog();
    this.editDialogVisible = true;
  }

  closeEditDialog(): void {
    this.previewUrl = null;
    this.selectedFile = null;

    this.editDialogVisible = false;
    this.editFandom = null;

    this.adminPanelService.closeDialog();
  }

  /* Edit & Add */
  saveChanges(): void {
    if (this.editFandom) {
      const formData = new FormData();
  
      formData.append('fandom', new Blob([JSON.stringify(this.editFandom)], { type: 'application/json' }));
  
      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile);
      }

      this.editFandom.name = this.editFandom.name.trim();

      const requiredFields = [
        this.editFandom.imageUrl,
        this.editFandom.name,
      ];
      
      if (requiredFields.some(field => !field)) {
        this.snackBarService.showError(this.translatedTexts["snackBarMessages"]["emptyFieldsError"]);
        return;
      }

      const currentUser = this.userService.getCurrentUserValue();
      if (currentUser && currentUser.id) {
        formData.append('userId', currentUser.id.toString());
      }
      

      if (this.editFandom.id != null) {
        // Edit fandom
        this.fandomService.editFandom(this.editFandom.id, formData).subscribe(
          (updatedFandom) => {
            const index = this.fandoms.data.findIndex(f => f.id === updatedFandom.id);
            this.fandoms.data[index] = updatedFandom;
            this.fandoms._updateChangeSubscription(); 
            this.closeEditDialog();
            this.snackBarService.showSuccess(this.translatedTexts["snackBarMessages"]["fandomUpdatedSuccess"]);
          },
          error => {
            this.snackBarService.showError(this.translatedTexts["snackBarMessages"]["unexpectedError"]);
          }
        );
      } else {
        // Add new fadnom
        this.fandomService.addFandom(formData).subscribe(
          (newFandom) => {
            this.fandoms.data.unshift(newFandom);
            this.fandoms._updateChangeSubscription();
            this.closeEditDialog();
            this.snackBarService.showSuccess(this.translatedTexts["snackBarMessages"]["fandomAddedSuccess"]);
          },
          error => {
            this.snackBarService.showError(this.translatedTexts["snackBarMessages"]["unexpectedError"]);
          }
        );
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
    const currentUser = this.userService.getCurrentUserValue();

    if (id !== null) {
      this.fandomService.deleteFandom(id, currentUser?.id).subscribe(
        () => {
          const index = this.fandoms.data.findIndex(fandoms => fandoms.id === id);

          if (index !== -1) {
            this.fandoms.data.splice(index, 1); 
            this.fandoms._updateChangeSubscription();
          }

          this.snackBarService.showSuccess(this.translatedTexts["snackBarMessages"]["fandomDeletedSuccess"]);
        },
        (error) => {
          this.snackBarService.showError(this.translatedTexts["snackBarMessages"]["unexpectedError"]);
        }
      );
    }
    this.closeDeleteDialog(); 
  } 

  /* Drag and Drop */
  isDragging: boolean = false;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    this.readImage(file);
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }
  
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.readImage(file);
    }
  }
  
  private readImage(file: File): void {
    const MAX_SIZE_MB = 1024;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * MAX_SIZE_MB;

    if (file instanceof File) {
      this.selectedFile = file; 

      if (file.size > MAX_SIZE_BYTES) {
        this.snackBarService.showError(this.translatedTexts["snackBarMessages"]["fileTooLarge"] + ` ${MAX_SIZE_MB / 1024}MB.`);
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.editFandom) {
          this.previewUrl = e.target?.result;
          this.editFandom.imageUrl = e.target.result;  
        }
      };
      reader.readAsDataURL(file);  
    }
  }  
}
