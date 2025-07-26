import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ActivityLog } from '../api/activity-logs.model';
import { ActivityLogsService } from '../api/activity-logs.service';
import { API_URL } from '../api/api-url';

import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-admin-panel-log-list',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatPaginator,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    FormsModule
],
  templateUrl: './admin-panel-log-list.component.html',
  styleUrl: '../admin-panel/admin-panel-main.component.scss'
})
export class AdminPanelLogListComponent implements OnInit {
  translatedTexts: Record<string, any> = {};
  apiUrl = API_URL.BASE_URL;

  logs = new MatTableDataSource<ActivityLog>([]);

  displayedColumns: string[] = [
    'date', 'action', 'name', 'username',
  ];

  actionLabels: Record<string, string> = {
    ADD_FIGURINE: 'Dodano figurkę',
    EDIT_FIGURINE: 'Edytowano figurkę',
    DELETE_FIGURINE: 'Usunięto figurkę',
    ADD_FANDOM: 'Dodano fandom',
    EDIT_FANDOM: 'Edytowano fandom',
    DELETE_FANDOM: 'Usunięto fandom',
  };

  constructor(private activityLogsService: ActivityLogsService) {}

  ngOnInit(): void {
    this.activityLogsService.getAllLogs().subscribe({
      next: (data) => {
        this.logs.data = data;
      },
      error: (err) => {
        console.error('Błąd podczas pobierania logów:', err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.logs.filter = filterValue;
  }

}
