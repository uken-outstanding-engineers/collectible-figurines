import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [
    { id: 1, username: 'admin', password: 'admin123', permission: 'admin' },
    { id: 2, username: 'user1', password: 'user123', permission: 'user' },
    { id: 3, username: 'user2', password: 'user456', permission: 'user' },
  ];

  constructor() {
    this.loadUserFromStorage();
  }

  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  getUserById(id: number): Observable<User | undefined> {
    return of(this.users.find(user => user.id === id));
  }

  private loggedInUser = new BehaviorSubject<User | null>(null);

  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      this.loggedInUser.next(user);
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      return true;
    }
    return false;
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
}

