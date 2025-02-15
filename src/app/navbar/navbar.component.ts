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
import { debounceTime, delay, distinctUntilChanged, filter, of, switchMap } from 'rxjs';

//import { LanguageModule } from '../language/language.module';

import { FigureService } from '../api/figure.service';
import { LanguageService } from '../language/language.service'; 
import { UserService } from '../api/user.service';
import { User } from '../api/user.model';
import { API_URL } from '../api/api-url';

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
  // searchTerm: string = '';
  translatedText: string;

  isLoggedIn: boolean = true;
  currentUser: User | null = null;

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
  }

  // private loadSearchResults(term: string) {
  //   this.figureService.searchFiguresByNameOrSeries(term).subscribe(results => {
  //     this.figureService.setSearchResults(results);
  //   });
  // }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
  }

  // searchFigures() {
  //   localStorage.setItem('searchTerm', this.searchTerm); 
  //   this.loadSearchResults(this.searchTerm); 
  //   this.router.navigate(['/search-results']);
  // }

  changeLanguage(lang: string): void {
    this.languageService.switchLanguage(lang); 
    this.currentLanguage = lang;                
    this.translatedText = this.translate.instant('collectible_figures');  
  }
  
  // isMenuOpen = false;

  // toggleMenu() {
  //   this.isMenuOpen = !this.isMenuOpen;
  // }

  // closeMenu() {
  //   this.isMenuOpen = false;
  // }

  searchTerm: string = '';
  searchResults: any[] = [];
  showResults: boolean = false; 

  searchFigures() {
    // Jeśli tekst ma mniej niż 2 znaki, nie wykonuj wyszukiwania
    if (this.searchTerm.length < 2) {
      this.searchResults = [];
      this.showResults = false;
      return;
    }
  
    of(this.searchTerm).pipe(
      debounceTime(300),  // Poczekaj 300ms po ostatnim wpisanym znaku (debouncing)
      distinctUntilChanged(),  // Wysyłaj zapytanie tylko, jeśli tekst się zmienia
      switchMap(term => {
        // Jeśli długość tekstu jest mniejsza niż 2, nie wykonuj zapytania
        if (term.length < 2) {
          return of([]);  // Zwróć pustą tablicę, żeby zapobiec zapytaniu do backendu
        }
        return this.figureService.searchFiguresByNameOrSeries(term);  // Wykonaj zapytanie
      })
    ).subscribe(results => {
      this.searchResults = results;  // Zapisz wyniki
      this.showResults = results.length > 0;  // Pokaż wyniki, jeśli są
    });
  }

  selectFigure(figure: any) {
    this.searchTerm = figure.name;
    this.searchResults = [];
    this.showResults = false;
    this.router.navigate(['/figure-details', figure.id]);
  }

  hideResults() {
    setTimeout(() => this.showResults = false, 200);
  }
}
