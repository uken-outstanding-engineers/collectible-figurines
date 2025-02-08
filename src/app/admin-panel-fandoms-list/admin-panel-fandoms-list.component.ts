import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { Fandom } from '../api/fandom.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';


import { FandomService } from '../api/fandom.service';
import { Subscription } from 'rxjs';

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
    MatIconModule
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

  openEditDialog(fandom: { id: number; name: string; series: string; imageUrl: string; hoverImageUrl: string; [key: string]: any }): void {

  }

  openDeleteDialog(id: number, name: string): void {

  }
}
