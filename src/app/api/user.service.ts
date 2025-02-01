import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
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

  //getUsers(): Observable<User[]> {
    //return of(this.users);
  //}

  //getUserById(id: number): Observable<User | undefined> {
    //return of(this.users.find(user => user.id === id));
  //}

  login(username: string, passwd: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, null, {
      params: new HttpParams()
        .set('username', username)
        .set('passwd', passwd),
      responseType: 'json' 
    }).pipe(
      tap((user: any) => {
        if (user && user !== 'User not found' && user !== 'Invalid password') {
          this.loggedInUser.next(user); 
          localStorage.setItem('loggedInUser', JSON.stringify(user));
        }
      })
    );
  }
  
  logout(): void {
    this.loggedInUser.next(null); 
    localStorage.removeItem('loggedInUser');
  }

  getLoggedInUser() {
    return this.loggedInUser.asObservable(); 
  }

  // isLoggedIn(): boolean {
  //   return this.loggedInUser.value !== null; 
  // }

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

