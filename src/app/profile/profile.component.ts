import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

import { UserService } from '../api/user.service';
import { User } from '../api/user.model';
import { API_URL } from '../api/api-url';
import { Figure } from '../api/figure.model';
import { FigureListService } from '../api/figure-list.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  apiUrl = API_URL.BASE_URL;

  user!: User;

  activeItem: string = 'liked';
  figurineLists: { [key: string]: Figure[] } = {};

  constructor(
    private figureListService: FigureListService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user: User) => {
      this.user = user;
    });
    this.loadUserFigurineLists();
  }

  setActive(item: string) {
    this.activeItem = item;
  }

  getActiveFigurines(): Figure[] {
    return this.figurineLists[this.activeItem] || [];
  }

  getListNames(): string[] {
    const fixedLists = ['liked', 'wanted', 'owned'];
    const allLists = Object.keys(this.figurineLists);
  
    const customLists = allLists.filter(list => !fixedLists.includes(list));
  
    return [...fixedLists, ...customLists]; 
  }
  
  formatListName(name: string): string {
    const formatted = name.replace(/_/g, ' ').toLowerCase();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  loadUserFigurineLists(): void {
    this.userService.getLoggedInUser().subscribe(user => {
      if (user && user.id) {
        this.figureListService.getUserFigurineLists(user.id).subscribe(lists => {
          this.figurineLists = lists;
        });
      }
    });
  }

}
