import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { debounceTime, delay, distinctUntilChanged, filter, of, Subject, switchMap } from 'rxjs';

//import { LanguageModule } from '../language/language.module';

import { FigureService } from '../api/figure.service';
import { LanguageService } from '../language/language.service'; 
import { UserService } from '../api/user.service';
import { User } from '../api/user.model';
import { API_URL } from '../api/api-url';
import { Figure } from '../api/figure.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule, 
    CommonModule,
    MatToolbarModule, 
    MatButtonModule, 
    MatMenuModule, 
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    TranslateModule  
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  apiUrl = API_URL.BASE_URL;
  
  currentLanguage: string = 'pl';
  translatedText: string;

  isLoggedIn: boolean = false;
  currentUser: User | null = null;

  private lastSearchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private figureService: FigureService, 
    private router: Router,
    private languageService: LanguageService,
    private translate: TranslateService,
    private userService: UserService
  ) {
    this.translatedText = this.translate.instant('collectible_figures');
  } 

  logout(): void {
    this.userService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.userService.getLoggedInUser().subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
    });
    
  
    // this.isLoggedIn = !!this.userService.getUser(); 
    // this.currentUser = this.userService.getUser();
    // console.log("Login: " + this.isLoggedIn);
    // console.log("User: " + this.currentUser?.avatarUrl);

    const savedLanguage = localStorage.getItem('language') || 'pl';
    this.currentLanguage = savedLanguage;
    this.languageService.switchLanguage(savedLanguage);
    this.translate.use(savedLanguage); 

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/search-results') {
          this.searchTerm = localStorage.getItem('searchTerm') || '';
          if (this.searchTerm) {
            //this.loadSearchResults(this.searchTerm); 
          }
        } else {
          this.searchTerm = '';
          localStorage.removeItem('searchTerm'); 
        }
      });

    this.searchSubject.pipe(
      debounceTime(300), 
      distinctUntilChanged(), 
      switchMap(term => term.length < 2 ? of([]) : this.figureService.searchFiguresByNameOrSeries(term))
    ).subscribe(results => {
      this.searchResults = results;
      this.showResults = results.length > 0;
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
  }

  changeLanguage(lang: string): void {
    this.languageService.switchLanguage(lang); 
    this.currentLanguage = lang;                
    this.translatedText = this.translate.instant('collectible_figures');  
  }

  searchTerm: string = '';
  searchResults: any[] = [];
  showResults: boolean = false; 

  searchFigures() {
    if (this.searchTerm.length < 2) {
      this.searchResults = [];
      this.showResults = false;
      return;
    }
    this.searchSubject.next(this.searchTerm); 
  }

  onFocus() {
    if (this.searchTerm.length >= 2 && this.searchTerm !== this.lastSearchTerm) {
      this.showResults = true;
    }
  }
  
  onBlur() {
    setTimeout(() => {
      this.showResults = false;
    }, 200); 
  }
  
  onInputChange() {
    this.lastSearchTerm = this.searchTerm;
  }

  selectFigure(figure: Figure) {
    this.searchTerm = figure.name;
    this.searchResults = [];
    this.showResults = false;
    this.router.navigate(['/figure', figure.id]);
  }
}
