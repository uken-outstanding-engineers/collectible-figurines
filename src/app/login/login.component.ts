import { Component, ElementRef, ViewChild} from '@angular/core';
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
  @ViewChild('errorBox') errorBox!: ElementRef;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  login(): void {
    this.userService.login(this.username, this.password).subscribe(user => {
      if (user) {
        this.router.navigate(['/figures-showcase']);
      } else {
        this.errorMessage = "Nieprawidłowy nazwa użytkonika lub hasło.";

        this.errorBox.nativeElement.classList.remove('show');
        void this.errorBox.nativeElement.offsetWidth; // Reset animacji
        this.errorBox.nativeElement.classList.add('show');
      }
    });
  }
}
