import { Injectable, OnDestroy } from '@angular/core';
import { ResourcesService } from '@services/resources.service';
import { Modules, Urls } from '@urls';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { Dashboard, NavigationService } from './navigation.service';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from './subscriber.service';

@Injectable()
export class DashboardService implements OnDestroy {
  private subList: SubscriptionObject[] = [];
  public isFullScreenDash = false;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private navigationService: NavigationService,
    private resourceService: ResourcesService
  ) {
    pushSubscription(
      'ReAuthDash',
      this.subList,
      this.authService.reAuthenticated.subscribe((value) => {
        if (value) {
          this.reloadConfiguration();
        }
      })
    );
    this.loadNavigations();
  }

  reloadConfiguration(): void {
    if (localStorage.User) {
      this.dataService
        .postData<Dashboard>(Urls.Dashboard.GetWebConfig)
        .then((data) => {
          this.navigationService.publishNavigationChange(data.navigations);
          if (data.globalConfig) {
            data.globalConfig.logoUrl = `${Modules.Images}${localStorage.TenantCode}/${data.globalConfig.logoUrl}`;
            this.navigationService.publishGlobalConfigChange(data.globalConfig);
          }
          if (this.authService.goToDash) {
            this.resourceService.navigateToDash();
          }
        });
    }
  }

  loadNavigations(): void {
    if (!localStorage.Navigations) {
      this.reloadConfiguration();
    } else {
      this.navigationService.publisLocalNavigations();
      this.navigationService.publisLocalConfigs();
    }
  }

  ngOnDestroy(): void {
    destroySubscriptions(this.subList);
  }
}
