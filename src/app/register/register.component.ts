import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

import { UserService } from '../api/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,    
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @ViewChild('errorBox') errorBox!: ElementRef;
  
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordsMatch });
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

    this.userService.register(username, email, password).subscribe(user =>{
      console.log(user);
      if (user && user.id) { 
        this.router.navigate(['/figures-showcase']);
      } else {
        if (user.error === 'USER_EXIST') {
          this.errorMessage = "Nazwa użytkownika jest już zajęta.";
        } else if (user.error === 'EMAIL_EXIST') {
          this.errorMessage = "Podany e-mail jest już używany.";
        } else {
          this.errorMessage = "Wystąpił nieznany błąd. Spróbuj ponownie.";
        }
        this.showErrorMessage();
      }
    });
  }

  showErrorMessage() {
    this.errorBox.nativeElement.classList.remove('show');
    void this.errorBox.nativeElement.offsetWidth; 
    this.errorBox.nativeElement.classList.add('show');
  }
}
