import { ChangeDetectorRef, Component } from '@angular/core';
import i18next from 'i18next';
import { Router } from '@angular/router';
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
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';

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
    //private cdr: ChangeDetectorRef
  ) {
    this.translatedText = this.translate.instant('collectible_figures');
    //console.log('Initial translation:', this.translatedText);
  } 

  // ngOnInit() {
  //   this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
  //     this.cdr.detectChanges(); 
  //   });
  // }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
  }

  searchFigures() {
    this.figureService.searchFiguresByName(this.searchTerm).subscribe(results => {
      this.figureService.setSearchResults(results); 
      this.router.navigate(['/search-results']);
    });
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

   changeLanguage(lang: string): void {
    this.translate.use(lang); 
    this.currentLanguage = lang;  
    this.translatedText = this.translate.instant('collectible_figures');  
  }
  
}
