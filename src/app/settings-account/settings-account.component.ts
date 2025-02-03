import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

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
    MatDialogModule
  ],
  templateUrl: './settings-account.component.html',
  styleUrl: './settings-account.component.scss'
})
export class SettingsAccountComponent {
  user!: User;
  editDialogVisible = false;
  editField: string = '';
  editValue: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user: User) => {
      this.user = user;
    });
  }

  openEditDialog(field: string, value: string) {
    this.editField = field;
    this.editValue = value;
    this.editDialogVisible = true;
  }

  closeEditDialog() {
    this.editDialogVisible = false;
  }

  saveChanges() {
    if (this.editField === 'Email') {
      this.user.email = this.editValue;
    } else if (this.editField === 'Username') {
      this.user.username = this.editValue;
    }

    //this.userService.updateUser(this.user).subscribe(() => {
      this.closeEditDialog();
      console.log(this.user);
    //});
  }
  
}
