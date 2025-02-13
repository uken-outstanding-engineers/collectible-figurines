import { Component, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { Figure } from '../api/figure.model';
import { FigureListService } from '../api/figure-list.service';
import { UserService } from '../api/user.service';
import { API_URL } from '../api/api-url';

@Component({
  selector: 'app-user-figurine-lists',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule
  ],
  templateUrl: './user-figurine-lists.component.html',
  styleUrl: './user-figurine-lists.component.scss'
})
export class UserFigurineListsComponent {
  apiUrl = API_URL.BASE_URL;

  activeItem: string = 'liked';
  figurineLists: { [key: string]: Figure[] } = {};

  constructor(private figureListService: FigureListService, private userService: UserService) {}

  ngOnInit() {
    this.loadUserFigurineLists();
  }

  setActive(item: string) {
    this.activeItem = item;
  }

  getActiveFigurines(): Figure[] {
    return this.figurineLists[this.activeItem] || [];
  }

  getListNames(): string[] {
    const fixedLists = ['liked', 'wanted'];
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

