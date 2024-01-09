import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Modules } from '@urls';
import { Subject } from 'rxjs';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from './subscriber.service';
import { WebsocketService } from './websocket.service';
import { WidgetMessageService } from './widget.message.service';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private subList: SubscriptionObject[] = [];
  public reAuthenticated: Subject<boolean> = new Subject<boolean>();
  goToDash = false;
  goToLogin = false;

  constructor(
    private router: Router,
    public websocketService: WebsocketService,
    public widgetMessageService: WidgetMessageService
  ) {
    pushSubscription(
      'ReAuth',
      this.subList,
      this.reAuthenticated.subscribe((value) => {
        if (value) {
          this.checkSocket();
        }
      })
    );

    if (this.isAuthenticated) {
      this.reloadUser();
    }
    this.checkSocket();
  }

  checkSocket(): void {
    this.websocketService.registerSocketUser();
    this.widgetMessageService.initializeMessages();
  }

  reloadUser(): void {
    this.reAuthenticated.next(true);
  }

  setupLocalValues(value: any): void {
    if (value !== undefined) {
      this.userSetup(value);
      this.reAuthenticated.next(true);
    }
  }

  onSignOut(): void {
    localStorage.clear();
    this.reAuthenticated.next(false);
    this.navigateToRoot();
  }

  public navigateToRoot(): void {
    let redirectUrl = '';
    if (Modules.TenantCode) {
      redirectUrl = `${Modules.TenantCode}`;
    }
    this.router.navigateByUrl(redirectUrl);
  }

  userSetup(userData: any): void {
    if (userData && userData.id && userData.id !== 0 && userData.accessToken) {
      localStorage.AccessToken = userData.accessToken;
      localStorage.TenantCode = userData.tenantCode;
      localStorage.UserName = userData.username;
      localStorage.User = JSON.stringify(userData);
    } else {
      this.onSignOut();
    }
  }

  isAuthenticated(): boolean {
    return localStorage.AccessToken ? true : false;
  }

  getUser(): any {
    return this.isAuthenticated ? localStorage.User : null;
  }

  getToken(): any {
    return this.isAuthenticated ? localStorage.AccessToken : null;
  }

  getRefreshToken(): any {
    return localStorage.RefreshToken;
  }

  ngOnDestroy(): void {
    destroySubscriptions(this.subList);
  }
}
