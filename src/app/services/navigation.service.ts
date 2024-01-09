import { Injectable } from '@angular/core';
import { GlobalConfig, IMenuItem } from '@dynamics/dynamics.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  menuItems: IMenuItem[] = [];

  publishNavigationChange(menuList: IMenuItem[]): void {
    this.menuItems = menuList;
    if (menuList && menuList.length) {
      localStorage.Navigations = JSON.stringify(menuList);
    }
  }

  publishGlobalConfigChange(globalConfig: GlobalConfig): void {
    if (globalConfig) {
      localStorage.GlobalConfig = JSON.stringify(globalConfig);
    }
  }

  publisLocalNavigations(): void {
    this.publishNavigationChange(this.getNavigationList());
  }

  publisLocalConfigs(): void {
    this.publishGlobalConfigChange(this.getGlobalConfig());
  }

  getNavigationList(): IMenuItem[] {
    return localStorage.Navigations && localStorage.Navigations !== 'null'
      ? JSON.parse(localStorage.Navigations)
      : null;
  }

  getGlobalConfig(): any {
    return localStorage.GlobalConfig && localStorage.GlobalConfig !== 'null'
      ? JSON.parse(localStorage.GlobalConfig)
      : null;
  }

  getAccessDetails(url: string): IMenuItem {
    let menuData: IMenuItem;
    if (localStorage.Navigations) {
      const menuCollection: IMenuItem[] = JSON.parse(localStorage.Navigations);
      menuData = this.getAccessDetailsCascaded(url, menuCollection);
    }
    return menuData;
  }

  getAccessDetailsCascaded(
    url: string,
    menuCollection: IMenuItem[]
  ): IMenuItem | null {
    let menuData: IMenuItem;
    menuData = menuCollection.find((x) => x.state === url);
    if (!menuData && menuCollection) {
      menuCollection.forEach((menuItem) => {
        if (!menuData && menuItem && menuItem.childItems) {
          menuData = this.getAccessDetailsCascaded(url, menuItem.childItems);
        }
      });
    }
    return menuData;
  }
}

export class Dashboard {
  public navigations: IMenuItem[];
  public globalConfig: GlobalConfig;
}
