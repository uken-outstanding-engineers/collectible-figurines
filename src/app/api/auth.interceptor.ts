import { HttpHandler, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const storedUser = localStorage.getItem('loggedInUser');
  const token = storedUser ? JSON.parse(storedUser).token : null;

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return next(cloned);
  }
  return next(req); 
};
