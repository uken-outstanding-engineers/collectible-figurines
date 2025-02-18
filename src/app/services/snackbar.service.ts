import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  showMessage(message: string, action: string = 'Zamknij', duration: number = 3000, panelClass: string[] = []): void {
    this.snackBar.open(message, action, {
      duration,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass,
    });
  }

  showSuccess(message: string, action: string = 'Zamknij', duration: number = 3000): void {
    this.showMessage(message, action, duration, ['success-snackbar']);
  }

  showError(message: string, action: string = 'Zamknij', duration: number = 3000): void {
    this.showMessage(message, action, duration, ['error-snackbar']);
  }
}
