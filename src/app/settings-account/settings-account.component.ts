import { Component, ElementRef, inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


import { User } from '../api/user.model';
import { UserService } from '../api/user.service';
import { API_URL } from '../api/api-url';

@Component({
  selector: 'app-settings-account',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './settings-account.component.html',
  styleUrl: '../settings/settings-panel.component.scss'
})
export class SettingsAccountComponent {
  apiUrl = API_URL.BASE_URL;

  user!: User;

  profileForm: FormGroup;
  formSubmitted = false;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService
  ) {
    this.profileForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.minLength(8)]],
        confirmPassword: ['', [Validators.minLength(8)]]
      },
      { 
        validators: [this.passwordsMatch, this.passwordsRequiredIfOneExists], 
        updateOn: 'change' 
      }
    );
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user: User) => {
      this.user = user;
      this.profileForm.patchValue({ email: user.email });
    });
  }

  passwordsMatch(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
  
    if (newPassword?.value && confirmPassword?.value && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else {
      if (confirmPassword?.hasError('mismatch')) {
        confirmPassword.setErrors(null);
      }
    }
  }
  
  passwordsRequiredIfOneExists(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
  
    if ((newPassword?.value && !confirmPassword?.value) || (!newPassword?.value && confirmPassword?.value)) {
      newPassword?.setErrors({ requiredIfOtherExists: true });
      confirmPassword?.setErrors({ requiredIfOtherExists: true });
    } else {
      if (newPassword?.hasError('requiredIfOtherExists')) {
        newPassword.setErrors(null);
      }
      if (confirmPassword?.hasError('requiredIfOtherExists')) {
        confirmPassword.setErrors(null);
      }
    }
  }

  saveProfile(): void {
    this.formSubmitted = true;
    if (this.profileForm.invalid) {
      return;
    }

    const formData = this.profileForm.value;

    this.userService.updateUserAccount(this.user.id, formData).subscribe(response => {
      if(response.error) {
        console.log(response.error)
        return;
      }

      this.profileForm.get('currentPassword')?.reset();
      this.profileForm.get('newPassword')?.reset();
      this.profileForm.get('confirmPassword')?.reset();
    });
  }
}

