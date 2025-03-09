import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SnackbarService } from '../services/snackbar.service';

import { API_URL } from '../api/api-url';
import { User } from '../api/user.model';
import { UserService } from '../api/user.service';
import { TranslationService } from '../services/translation.service';


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
  translatedTexts: { [key: string]: string } = {};

  user: User | null = null;;
  deletedPhoto: boolean = false;
  isDisabledUsername: boolean = true;

  constructor(
    private userService: UserService,
    private snackBarService: SnackbarService,
    private translationService: TranslationService,
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user: User) => {
      this.user = user;
    });    

    this.translationService.translations$.subscribe(translations => {
      this.translatedTexts = translations?.['settings']?.['profile_settings_page'] || {};
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
    if(this.selectedFile == null && !this.deletedPhoto) {
      this.snackBarService.showMessage(this.translatedTexts["nothingChanged"]);
      return;
    }

    if(!this.user) return;

    if (!this.selectedFile && this.user.avatarUrl === null) { 
      this.userService.uploadAvatar(this.user.id, null).subscribe(updatedUser => {
        this.snackBarService.showSuccess(this.translatedTexts["updatedProfile"]);
        this.deletedPhoto = false;
      });
      return;
    }

    this.userService.uploadAvatar(this.user.id, this.selectedFile).subscribe(updatedUser => {
      this.user!.avatarUrl = this.userService.getAvatarUrl();
      this.avatarPreview = null;
      this.snackBarService.showSuccess(this.translatedTexts["updatedProfile"]);
      this.deletedPhoto = false;
    });
  }

  onAvatarSelected(event: any): void {
    const file = event.target.files[0];
    const MAX_SIZE_MB = 1024;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * MAX_SIZE_MB;

    if (file) {
      if (file.size > MAX_SIZE_BYTES) {
        this.snackBarService.showError(this.translatedTexts["maximumSizeFile"] + ` ${MAX_SIZE_MB / 1024}MB.`);
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => this.avatarPreview = e.target.result;
      reader.readAsDataURL(file);

      event.target.value = '';
    }
  }

  deleteAvatar(): void {
    this.selectedFile = null;
    this.avatarPreview = null;
    this.user!.avatarUrl = null;
    this.deletedPhoto = true;
  }
}
