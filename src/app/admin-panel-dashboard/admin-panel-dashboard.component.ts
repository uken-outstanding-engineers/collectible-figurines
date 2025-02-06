import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { FigureService } from '../api/figure.service';
import { UserService } from '../api/user.service';

@Component({
  selector: 'app-admin-panel-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './admin-panel-dashboard.component.html',
  styleUrl: './admin-panel-dashboard.component.scss'
})
export class AdminPanelDashboardComponent {
  totalFigurines = 0;  
  totalUsers = 0;       
  activeUsers = 0;  

  constructor(private router: Router, private figureService: FigureService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadTotalFigurines();
    this.loadTotalUsers();
    this.loadActiveUsers();
  }

  loadTotalFigurines(): void {
    this.figureService.getTotalFigurines().subscribe(
      (data) => {
        this.totalFigurines = data;
      }
    );
  }

  loadTotalUsers(): void {
    this.userService.getTotalUsers().subscribe(
      (data) => {
        this.totalUsers = data;
      }
    );
  }

  loadActiveUsers(): void {
    this.userService.getActiveUsers().subscribe(
      (data) => {
        this.activeUsers = data;
      }
    );
  }

  navigateToFigurines( route: string): void {
    this.router.navigate([route]);
  }
}
