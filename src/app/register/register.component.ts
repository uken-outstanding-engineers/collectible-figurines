import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { UserService } from '../api/user.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,    
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    TranslateModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  translatedTexts: Record<string, any> = {};

  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    private snackBarService: SnackbarService,
    private translationService: TranslationService
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      }, 
      { validator: this.passwordsMatch}
    );

    this.translationService.translations$.subscribe(translations => {
      this.translatedTexts = translations?.['register'] || {};
    });
  }

  passwordsMatch(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
  
    if (password === confirmPassword) {
      form.get('confirmPassword')?.setErrors(null);
      return null;
    }
  
    form.get('confirmPassword')?.setErrors({ mismatch: true });
    return { mismatch: true };
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
  
    const { username, email, password } = this.registerForm.value;
  
    this.userService.register(username.trim(), email.trim(), password).subscribe(
      (user: any) => {
        if (user.error) {
          this.snackBarService.showError(this.translatedTexts["snackBarMessages"]["unknownError"]);
        } else {
          this.router.navigate(['/figures-showcase']);
        }
      },
      (error) => {
        console.log(error.message);
        if (error.message === 'USER_EXIST') {
          this.snackBarService.showError(this.translatedTexts["snackBarMessages"]["usernameTaken"]);
        } else if (error.message === 'EMAIL_EXIST') {
          this.snackBarService.showError(this.translatedTexts["snackBarMessages"]["emailInUse"]);
        } else {
          this.snackBarService.showError(this.translatedTexts["snackBarMessages"]["unknownError"]);
        }
      }
    );
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else if (field === 'confirmPassword') {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }
}
