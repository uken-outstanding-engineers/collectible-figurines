import { Component, ElementRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms'; 

import { UserService } from '../api/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    TranslateModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  translatedTexts: Record<string, any> = {};

  username: string = '';
  password: string = '';
  
  constructor(
    private userService: UserService,
    private router: Router,
    private snackBarService: SnackbarService,
    private translationService: TranslationService,
  ) {
    this.translationService.translations$.subscribe(translations => {
      this.translatedTexts = translations?.['login'] || {};
    });
  }

  login(): void { 
    if (this.username.trim() === "" || this.password.trim() === "") {
      this.snackBarService.showError(this.translatedTexts["snackBarMessages"]["emptyFieldsError"]);
      return;
    }

    this.userService.login(this.username.trim(), this.password.trim()).subscribe(user => {
      if (user) {
        this.router.navigate(['/figures-showcase']);
      } else {
        this.snackBarService.showError(this.translatedTexts["snackBarMessages"]["invalidCredentialsError"]);
      }
    });
  }
}
