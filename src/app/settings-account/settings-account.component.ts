import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { User } from '../api/user.model';
import { UserService } from '../api/user.service';

@Component({
  selector: 'app-settings-account',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './settings-account.component.html',
  styleUrl: './settings-account.component.scss'
})
export class SettingsAccountComponent {
  user!: User;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user: User) => {
      this.user = user;
    });
  }
}
