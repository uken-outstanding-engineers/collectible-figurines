import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  //private users: User[] = [
    //{ id: 1, email: "admin@figurines.pl", username: 'admin', password: 'admin123', permission: 'ADMIN' },
    //{ id: 2, email: "user1@figurines.pl", username: 'user1', password: 'user123', permission: 'USER' },
    //{ id: 3, email: "user2@figurines.pl", username: 'user2', password: 'user456', permission: 'USER' },
  //];

  private API_URL = 'http://localhost:8080/api/users';
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
          this.loggedInUser.next(user);
          localStorage.setItem('loggedInUser', JSON.stringify(user));
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
      tap((user: any) => {
        if (user) {
          this.loggedInUser.next(user); 
          localStorage.setItem('loggedInUser', JSON.stringify(user));
        }
      }),
      catchError((error) => {
        console.error('Register error:', error);
        return throwError(() => new Error(error.message || 'Registration failed'));
      })
    );
  }

    // Update E-mail
    // updateEmail(userId: number, newEmail: string) {
    //   return this.http.put<string>(`${this.API_URL}${userId}/newEmail`, newEmail).pipe(
    //     tap(updatedEmail => {
    //       const currentUser = this.loggedInUser.getValue();
    //       if (currentUser) {
    //         currentUser.email = updatedEmail;  
    //         this.loggedInUser.next(currentUser);
    //       }
    //     })
    //   );
    // }
    
  
  logout(): void {
    this.loggedInUser.next(null); 
    localStorage.removeItem('loggedInUser');
  }

  getLoggedInUser() {
    return this.loggedInUser.asObservable(); 
  }

  isAuthenticated(): boolean {
    return this.loggedInUser !== null;
  }

  getCurrentUser(): any {
    return this.loggedInUser;
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      this.loggedInUser.next(JSON.parse(storedUser)); 
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
}

