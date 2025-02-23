import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations = new BehaviorSubject<any>({});
  translations$ = this.translations.asObservable();

  constructor(private translate: TranslateService) {
    this.loadTranslations();

    this.translate.onLangChange.subscribe(() => {
      this.loadTranslations();
    });
  }

  private loadTranslations(): void {
    this.translate.getTranslation(this.translate.currentLang).subscribe(translations => {
      this.translations.next(translations);
    });
  }

  getSection(section: string): any {
    return this.translations.value[section] || {};
  }
}
