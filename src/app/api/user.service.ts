import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';

import { User } from './user.model';
import { API_URL } from './api-url';

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

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
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
        if (user) {
          const userWithToken = { ...user, token: user.token };
          this.loggedInUser.next(userWithToken);
          localStorage.setItem('loggedInUser', JSON.stringify(userWithToken));
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
  uploadAvatar(userId: number, avatar: File | null): Observable<User> {
    const formData = new FormData();
  
    if (avatar) {
      formData.append('avatar', avatar);
    } else {
      formData.append('avatar', new Blob()); 
    }
  
    return this.http.put<User>(`${this.API_URL}/${userId}/avatar`, formData).pipe(
      tap((updatedUser) => {
        const currentUser = this.loggedInUser.getValue();
        if (currentUser) {
          currentUser.avatarUrl = updatedUser.avatarUrl || null; 
          this.loggedInUser.next(currentUser);
          localStorage.setItem('loggedInUser', JSON.stringify(currentUser));
        }
      }),
      catchError((error) => {
        console.error('Error uploading avatar:', error);
        return throwError(() => new Error(error.message || 'Avatar upload failed'));
      })
    );
  }    

  //Update User Account
  updateUserAccount(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${userId}/update-account`, userData).pipe(
      tap((updatedUser: any) => {
        if (updatedUser.error) { 
          console.error('Error updating profile:', updatedUser.error);
          return;  
        }
        this.loggedInUser.next(updatedUser);
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser)); 
      }),
      catchError((error) => {
        console.error('Profile update error:', error);
        return throwError(() => new Error(error.message || 'Profile update failed'));
      })
    );
  }

  //Get user stats about figurines
  getUserStats(userId: number): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.API_URL}/${userId}/stats`);
  }
  
  logout(): void {
    //this.loggedInUser.next(null);
    localStorage.removeItem('loggedInUser');
  }

  getLoggedInUser() {
    return this.loggedInUser.asObservable(); 
  }

  // isAuthenticated(): boolean {
  //   return this.loggedInUser !== null;
  // }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): any {
    return this.loggedInUser;
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('loggedInUser');
    
    if (storedUser && storedUser !== 'undefined') {
      try {
        const user = JSON.parse(storedUser);
        this.loggedInUser.next(user);
      } catch (e) {
        console.error('Error parsing user data from localStorage', e);
        this.loggedInUser.next(null);
      }
    } else {
      this.loggedInUser.next(null);
    }
  }

  hasAccess(): boolean {
    const userString = localStorage.getItem('loggedInUser'); 
    if (!userString) {
      return false;
    }

    const user = JSON.parse(userString);
    if (user && user.permission === 'ADMIN') { 
      return true;
    } 
    return false;
  }

  hasLogin(): boolean {
    const userString = localStorage.getItem('loggedInUser'); 
    if (!userString) {
      return false;
    }

    const user = JSON.parse(userString);
    if (user) { 
      return true;
    }

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
    return decodedToken && decodedToken.roles ? decodedToken.roles : '';
  }

  // hasRole(role: string): boolean {
  //   return this.getRoles().includes(role);
  // }
}

