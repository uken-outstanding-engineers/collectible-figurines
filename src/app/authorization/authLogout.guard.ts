import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../api/user.service';  

@Injectable({
  providedIn: 'root'
})
export class AuthLogoutGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    if (!this.userService.hasLogout()) {
        return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}