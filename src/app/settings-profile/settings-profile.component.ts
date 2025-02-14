import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

import { API_URL } from '../api/api-url';
import { User } from '../api/user.model';
import { UserService } from '../api/user.service';

@Component({
  selector: 'app-settings-profile',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule
  ],
  templateUrl: './settings-profile.component.html',
  styleUrl: '../settings/settings-panel.component.scss'
})
export class SettingsProfileComponent {
  apiUrl = API_URL.BASE_URL;
  
  user!: User;
  isDisabledUsername: boolean = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user: User) => {
      this.user = user;
    });
  }

  saveProfile(): void {
    this.saveAvatar();
  }

  /* Upload Avatar */
  avatarPreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  triggerFileInput(): void {
    const fileInput = document.getElementById('avatarUpload') as HTMLInputElement;
    fileInput.click();
  }

  saveAvatar(): void {
    if (!this.selectedFile && this.user.avatarUrl === null) { 
      this.userService.uploadAvatar(this.user.id, null).subscribe(updatedUser => {});
      return;
    }
  
    if (!this.selectedFile) return;


    this.userService.uploadAvatar(this.user.id, this.selectedFile).subscribe(updatedUser => {
      this.user.avatarUrl = updatedUser.avatarUrl;
      this.avatarPreview = null;
    });
  }

  onAvatarSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => this.avatarPreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  deleteAvatar(): void {
    this.selectedFile = null;
    this.avatarPreview = null;
    this.user.avatarUrl = null;
  }
}
