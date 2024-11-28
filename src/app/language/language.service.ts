import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  
  constructor(private translate: TranslateService) {
    const savedLanguage = localStorage.getItem('language') || 'pl';
    this.setLanguage(savedLanguage);
  }

  switchLanguage(language: string): void {
    this.setLanguage(language);
    localStorage.setItem('language', language);  
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || 'pl';  
  }

  private setLanguage(language: string): void {
    this.translate.setDefaultLang(language);  
    this.translate.use(language);  
  }
}
