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
      next: (user) => {
        //console.log('Zalogowany użytkownik:', user);
        this.router.navigate(['/figures-showcase']);
      },
      error: (err) => {
        this.errorMessage = err.error;
        console.error('Błąd logowania:', err);
      }
    });
  }  
}
