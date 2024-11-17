import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success'],
      verticalPosition: 'top',
    });
  }

  showError(errors: string[]) {
    errors.forEach((error) => {
      this.snackBar.open(error, 'Close', {
        duration: 5000,
        panelClass: ['snackbar-error'],
        verticalPosition: 'top',
      });
    });
  }
}
