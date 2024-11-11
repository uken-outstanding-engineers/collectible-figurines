import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('pl');
    this.translate.use('pl');
  }

  switchLanguage(language: string): void {
    this.translate.use(language).subscribe(() => {});
  }
  
  getCurrentLanguage(): string {
    const currentLang = this.translate.currentLang || 'pl';
    return currentLang;
  }
}
