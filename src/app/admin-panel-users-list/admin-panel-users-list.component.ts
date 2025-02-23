import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; 
import { MatPaginator } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

import { User } from '../api/user.model';
import { UserService } from '../api/user.service';
import { API_URL } from '../api/api-url';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-admin-panel-users',
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
  ],
  templateUrl: './admin-panel-users-list.component.html',
  styleUrl: '../admin-panel/admin-panel-main.component.scss'
})
export class AdminPanelUsersComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  apiUrl = API_URL.BASE_URL;
  translatedTexts: Record<string, any> = {};

  users = new MatTableDataSource<User>([]);

  displayedColumns: string[] = [
    'avatarUrl', 'username', 'permission', 'lastLogin'
  ];

  private subscription: Subscription;

  constructor(
    private userService: UserService,
    private translationService: TranslationService,
  ) {
    this.subscription = this.userService.getUsers().subscribe((data: User[]) => {
      this.users.data = data.map(user => ({
        ...user,
        lastLogin: new Date(user.lastLogin).toISOString().split('T')[0]
      }));
    });
    
    this.translationService.translations$.subscribe(translations => {
      this.translatedTexts = translations?.['admin_panel']?.['users_list_page'] || {};
    });
  }

  ngAfterViewInit() {
    this.users.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.users.filter = filterValue;
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
    // if (this.selectedId !== null) {
    //   this.figureService.deleteFigure(this.selectedId).subscribe(
    //     () => {
    //       this.figurines.data = this.figurines.data.filter(figure => figure.id !== this.selectedId);
    //       this.figurines._updateChangeSubscription();
    //       this.closeDeleteDialog();  
    //       //console.log('The figurine has been removed');
    //     },
    //     (error) => {
    //       //console.error('Error while deleting figure', error);
    //     }
    //   );
    // }
  }
}
