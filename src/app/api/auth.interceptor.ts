import { HttpHandler, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators'
import { throwError } from 'rxjs';

import { UserService } from './user.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const storedUser = localStorage.getItem('loggedInUser');
  const token = storedUser ? JSON.parse(storedUser).token : null;

  const userService = inject(UserService);
  const router = inject(Router);

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      }
    });
    return next(cloned).pipe(
      catchError((error) => {
        if (error.status === 401 || error.status === 403) {
          userService.logout(); 
          router.navigate(['/figures-showcase']);
        }
        return throwError(() => new Error(error.message || 'Unauthorized'));
      })
    );
  }
  return next(req); 
};
