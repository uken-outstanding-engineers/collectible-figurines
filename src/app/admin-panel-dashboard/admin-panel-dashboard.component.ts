import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-panel-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule
  ],
  templateUrl: './admin-panel-dashboard.component.html',
  styleUrl: './admin-panel-dashboard.component.scss'
})
export class AdminPanelDashboardComponent {
  totalFigurines = 120;  
  totalUsers = 45;       
  activeUsers = 12;  

  cols = window.innerWidth < 768 ? 1 : 3;
  gutterSize = window.innerWidth < 768 ? '40px' : '0px 20px';

  constructor() {
    window.addEventListener('resize', () => {
      this.cols = window.innerWidth < 768 ? 1 : 3;
      this.gutterSize = window.innerWidth < 768 ? '30px' : '0';
    });
  }
}
