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

import { LanguageModule } from '../language/language.module';

import { FigureService } from '../figures-showcase/figure.service';
import { LanguageService } from '../language/language.service'; 

import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

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
    LanguageModule,
    TranslateModule  
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  
  currentLanguage: string = 'pl';

  searchTerm: string = '';

  translatedText: string;

  constructor(
    private figureService: FigureService, 
    private router: Router,
    private languageService: LanguageService,
    private translate: TranslateService,
  ) {
    this.translatedText = this.translate.instant('collectible_figures');
  } 

  ngOnInit(): void {
    const savedLanguage = localStorage.getItem('language') || 'pl';
    console.log(savedLanguage);
    this.currentLanguage = savedLanguage;
    this.languageService.switchLanguage(savedLanguage);
    this.translate.use(savedLanguage); 

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/search-results') {
          this.searchTerm = localStorage.getItem('searchTerm') || '';
          if (this.searchTerm) {
            this.loadSearchResults(this.searchTerm); 
          }
        } else {
          this.searchTerm = '';
          localStorage.removeItem('searchTerm'); 
        }
      });
  }

  private loadSearchResults(term: string) {
    this.figureService.searchFiguresByNameOrSeries(term).subscribe(results => {
      this.figureService.setSearchResults(results);
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
  }

  searchFigures() {
    localStorage.setItem('searchTerm', this.searchTerm); 
    this.loadSearchResults(this.searchTerm); 
    this.router.navigate(['/search-results']);
  }

  changeLanguage(lang: string): void {
    this.languageService.switchLanguage(lang); 
    this.currentLanguage = lang;                
    this.translatedText = this.translate.instant('collectible_figures');  
    console.log(lang);
  }
  

  // isMenuOpen = false;

  // toggleMenu() {
  //   this.isMenuOpen = !this.isMenuOpen;
  // }

  // closeMenu() {
  //   this.isMenuOpen = false;
  // }
}
