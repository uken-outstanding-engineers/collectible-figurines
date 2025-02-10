import { Component, ElementRef, inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { User } from '../api/user.model';
import { UserService } from '../api/user.service';

@Component({
  selector: 'app-settings-account',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './settings-account.component.html',
  styleUrl: './settings-account.component.scss'
})
export class SettingsAccountComponent {
  @ViewChild('errorBox') errorBox!: ElementRef;
  
  user!: User;
  editDialogVisible = false;
  editField: string = '';

  currentValue: string = '';
  editValue: string = ''; 
  editConfirmValue: string = '';

  currentPassword: string = ''; 
  newPassword: string = ''; 
  confirmNewPassword: string = ''; 

  errorMessage: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user: User) => {
      this.user = user;
    });
  }

  openEditDialog(field: string, value: string) {
    this.errorMessage = '';
    this.editField = field;
    this.currentValue = value;
    this.editDialogVisible = true;
  }

  closeEditDialog() {
    this.editValue = ''; 
    this.editConfirmValue = '';
  
    this.currentPassword = ''; 
    this.newPassword = ''; 
    this.confirmNewPassword = ''; 

    this.editDialogVisible = false;
  }

  saveChanges() {
    if (this.currentValue === this.editValue) {
      this.errorMessage = `${this.editField} musi być inny od obecnego!`;
      this.showErrorMessage();
      return;
    }

    if (this.editField === 'Email') {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailPattern.test(this.editValue)) {
        this.errorMessage = 'Wprowadź poprawny adres email!';
        this.showErrorMessage();
        return;
      }

      if (this.editValue !== this.editConfirmValue) {
        this.errorMessage = 'Email nie jest zgodny!';
        this.showErrorMessage();
        return;
      }

      this.user.email = this.editValue;
      console.log('Email updated successfully');

      // this.userService.updateEmail(this.user.id, this.editValue).subscribe(
      //   (data) => {
          
      //   },
      //   (error) => {
      //     this.errorMessage = 'Błąd podczas aktualizacji e-maila';
      //     this.showErrorMessage();
      //   }
      // );
  
    } else if (this.editField === 'Username') {
      if (this.editValue.length < 3) {
        this.errorMessage = 'Nazwa użytkownika musi mieć min. 3 znaki!';
        this.showErrorMessage();
        return;
      }

      if (this.editValue !== this.editConfirmValue) {
        this.errorMessage = 'Nazwa użytkonika nie jest zgdona!';
        this.showErrorMessage();
        return;
      }

      this.user.username = this.editValue;
      console.log('Saving new username:', this.editValue);
  
    } else if (this.editField === 'Password') {
      if (!this.newPassword || !this.confirmNewPassword) {
        this.errorMessage = 'Wprowadź dane!';
        this.showErrorMessage();
        return;
      }
      
      if (this.newPassword === this.confirmNewPassword) {
        this.errorMessage = 'Nowe hasło nie może być takie same!';
        this.showErrorMessage();
        return;
      }

      if (this.newPassword !== this.confirmNewPassword) {
        this.errorMessage = 'Hasła nie są zgodne!';
        this.showErrorMessage();
        return;
      }
  
      if (this.newPassword.length < 8) {
        this.errorMessage = 'Hasło musi mieć min. 8 znaków!';
        this.showErrorMessage();
        return;
      }
  
      console.log('Saving new password');
    }
  
    this.closeEditDialog();
  }

  showErrorMessage() {
    this.errorBox.nativeElement.classList.remove('show');
    void this.errorBox.nativeElement.offsetWidth; 
    this.errorBox.nativeElement.classList.add('show');
  }
}
