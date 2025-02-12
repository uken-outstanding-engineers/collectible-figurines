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
    
  fandoms = new MatTableDataSource<Fandom>([]);

  displayedColumns: string[] = [
    'imageUrl', 'name', 'action'
  ];

  private subscription: Subscription;

  constructor(private fandomService: FandomService) {
    this.subscription = this.fandomService.getFandoms().subscribe((data: Fandom[]) => {
      this.fandoms.data = data;
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
      id: 0,
      name: '',
      imageUrl: '',
    };
    this.editDialogVisible = true;
  }

  /* Edit */
  editDialogVisible = false;
  editFandom: { id: number; name: string; imageUrl: string;} | null = null;

  openEditDialog(fandom: { id: number; name: string; imageUrl: string; }): void {
    this.editFandom = { ...fandom };
    console.log(this.editFandom.imageUrl);
    this.editDialogVisible = true;
  }

  closeEditDialog(): void {
    this.editDialogVisible = false;
    this.editFandom = null;
  }

  /* Edit & Add */
  saveChanges(): void {
    if (this.editFandom) {
      const index = this.fandoms.data.findIndex(f => f.id === this.editFandom?.id);
  
      if (index !== -1 && this.editFandom.id > 0) {
        // Edit fandom
        this.fandomService.editFandom(this.editFandom.id, this.editFandom).subscribe((updatedFandom) => {
          this.fandoms.data[index] = { ...updatedFandom };
          this.fandoms._updateChangeSubscription(); 
          this.closeEditDialog();
        });
      } else {
        // Add new fadnom
        this.fandomService.addFandom(this.editFandom).subscribe((newFandom) => {
          this.fandoms.data.push(newFandom);
          this.fandoms._updateChangeSubscription();
          this.closeEditDialog();
        });
      }
    }
  }

  /* Drag and Drop */
  isDragging: boolean = false;

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
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (this.editFandom) {
        this.editFandom.imageUrl = e.target.result;
      }
    };
    reader.readAsDataURL(file);
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
      this.fandomService.deleteFandom(this.selectedId).subscribe(
        () => {
          this.fandoms.data = this.fandoms.data.filter(fandoms => fandoms.id !== this.selectedId);
          this.fandoms._updateChangeSubscription();
          this.closeDeleteDialog();  
        },
        (error) => {
          //console.error('Error while deleting fandoms', error);
        }
      );
    }
  }   
}
