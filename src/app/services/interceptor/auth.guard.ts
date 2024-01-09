import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.authService.onSignOut();
    }
    return this.authService.isAuthenticated();
  }
}
