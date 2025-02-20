import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';

import { User } from './user.model';
import { API_URL } from './api-url';

interface TokenResponse {
  token: string;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


@Injectable({
  providedIn: 'root',
})
export class UserService {
  //private users: User[] = [
    //{ id: 1, email: "admin@figurines.pl", username: 'admin', password: 'admin123', permission: 'ADMIN' },
    //{ id: 2, email: "user1@figurines.pl", username: 'user1', password: 'user123', permission: 'USER' },
    //{ id: 3, email: "user2@figurines.pl", username: 'user2', password: 'user456', permission: 'USER' },
  //];

  private API_URL = `${API_URL.BASE_URL}/api/users`;

  private loggedInUser = new BehaviorSubject<User | null>(null);
  //public currentUser$ = this.loggedInUser.asObservable();

  constructor(private http: HttpClient) {
    //this.loadUserFromStorage();
  }

  // Download the users list
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/all`);
  }

  // Download the number of users
  getTotalUsers(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/total`);
  }

  // Download the number of active users (last month)
  getActiveUsers(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/active`);
  }

  //Login user
  login(username: string, passwd: string) {
    return this.http.post(`${this.API_URL}/login`, null, {
      params: new HttpParams().set('username', username).set('passwd', passwd),
      responseType: 'json',
    }).pipe(
      tap((user: any) => {
        if (user && user.token) {
          const userWithToken = { ...user, token: user.token };
          localStorage.setItem('loggedInUser', JSON.stringify(userWithToken));
          this.addDataToUser();
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.message || 'Login failed'));
      })
    );
  }

  //Register user
  register(username: string, email: string, passwd: string) {
    const registerData = { username, email, passwd };
  
    return this.http.post(`${this.API_URL}/register`, registerData).pipe(
      map((response: any) => {
        if (response.error) {
          throw new Error(response.error);
        }
        return response; 
      }),
      tap((user: any) => {
        if (user) {
          this.loggedInUser.next(user); 
          localStorage.setItem('loggedInUser', JSON.stringify(user));
        }
      }),
      catchError((error) => {
        return throwError(() => new Error(error.message || 'Registration failed'));
      })
    );
  }

  //Uplad Avatar
  uploadAvatar(userId: number, avatar: File | null): Observable<void> {
    const formData = new FormData();
  
    if (avatar) {
      formData.append('avatar', avatar);
    } else {
      formData.append('avatar', new Blob());
    }

    return this.http.put<TokenResponse>(`${this.API_URL}/${userId}/avatar`, formData).pipe(
      tap((user: any) => {
        
        if (user && user.token) {
          const userWithToken = { ...user, token: user.token };
          localStorage.setItem('loggedInUser', JSON.stringify(userWithToken));
  
          this.addDataToUser();
        }
      }),
      catchError((error) => {
        console.error('Error uploading avatar:', error);
        return throwError(() => new Error(error.message || 'Avatar upload failed'));
      })
    );
  }
    
  //Update User Account
  updateUserAccount(userId: number, userData: any): Observable<TokenResponse | null> {
    return this.http.put<ApiResponse<TokenResponse>>(`${this.API_URL}/${userId}/update-account`, userData).pipe(
      map(response => {
        if (!response.success) {
          const errorResponse = { ...response.data, error: response.message || 'ERROR' };
          return errorResponse;
        }
  
        if (response.data?.token) {
          const userWithToken = { ...response, token: response.data.token };
          localStorage.setItem('loggedInUser', JSON.stringify(userWithToken));
          this.addDataToUser();
        }
  
        return response.data;
      }),
      catchError(error => {
        return throwError(() => new Error(error.message || 'Profile update failed'));
      })
    );
  }
  

  //Get user stats about figurines
  getUserStats(userId: number): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.API_URL}/${userId}/stats`);
  }

  addDataToUser() {
    const decodedUser = this.decodeToken();
    if (decodedUser) {
      const userFromToken: User = this.getUser() || {
        id: 0,
        username: '',
        email: '',
        password: '',
        permission: '',
        lastLogin: '',
        avatarUrl: null
      };

      this.loggedInUser.next(userFromToken);
    }
  }
  
  logout(): void {
    localStorage.removeItem('loggedInUser');
    this.loggedInUser.next(null);
  }

  getLoggedInUser(): Observable<User | null> {
    const user = this.getUser(); 
    this.loggedInUser.next(user); 
    return this.loggedInUser.asObservable(); 
  }
  
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): any {
    return this.loggedInUser;
  }

  // private loadUserFromStorage(): void {
  //   const storedUser = localStorage.getItem('loggedInUser');

  //   if (storedUser) {
  //     try {
  //       const user = JSON.parse(storedUser);
  //       this.loggedInUser.next(user);
  //     } catch (e) {
  //       console.error('Błąd parsowania danych użytkownika:', e);
  //       this.loggedInUser.next(null);
  //     }
  //   }
  // }

  hasAccess(): boolean {
    return this.getPermission() === 'ADMIN';
  }
  
  hasLogin(): boolean {
    //return !!this.getUser();
    return false;
  }
  
  /* TOKEN */
  getToken(): string | null {
    const userWithToken = localStorage.getItem('loggedInUser');
    if (userWithToken) {
      const parsedUser = JSON.parse(userWithToken);
      return parsedUser.token || null;
    }
    return null;
  }
  

  decodeToken(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Błąd dekodowania tokena:', error);
      return null;
    }
  }

  getUser(): User | null {
    const decodedToken = this.decodeToken();
    if (!decodedToken) {
      return null;
    }
  
    return {
      id: decodedToken.id,
      email: decodedToken.email,
      username: decodedToken.sub, 
      password: '', 
      permission: decodedToken.permission,
      lastLogin: '', 
      avatarUrl: decodedToken.avatarUrl || '', 
    };
  }
  
  
  getUserId(): number | null {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.id : null;
  }

  getUsername(): string | null {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.sub : null;
  }

  getEmail(): string | null {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.email : null;
  }

  getPermission(): string {
    const decodedToken = this.decodeToken();
    return decodedToken && decodedToken.permission ? decodedToken.permission : '';
  }

  getAvatarUrl(): string {
    const decodedToken = this.decodeToken();
    return decodedToken && decodedToken.avatarUrl ? decodedToken.avatarUrl : '';
  }

}

