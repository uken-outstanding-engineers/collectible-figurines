import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms'; 

import { UserService } from '../api/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    TranslateModule,
    FormsModule  
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  // login(): void {
  //   if (this.userService.login(this.username, this.password)) {
  //     console.log('Zalogowany:', this.username);
  //     this.router.navigate(['/figures-showcase']);
  //   } else {
  //     console.log('Złe dane');
  //   }
  // }

  login(): void {
    this.userService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Odpowiedź z backendu:', response);
  
        if (response.includes('User not found') || response.includes('Invalid password')) {
          this.errorMessage = 'Nieprawidłowe dane logowania';
          console.error('Błąd logowania:', response);
        } else {
          console.log('Zalogowany');
          // this.router.navigate(['/figures-showcase']);
        }
      },
      error: (err) => {
        console.error('Błąd logowania:', err);
        this.errorMessage = 'Wystąpił błąd serwera';
      }
    });
  }
}
