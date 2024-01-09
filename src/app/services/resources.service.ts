import { Injectable, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PageType } from '@dynamics/dynamics.constants';
import { IMenuItem, ResourceRequest } from '@dynamics/dynamics.interface';
import { LocalConfig } from '@urls';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavigationService } from './navigation.service';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from './subscriber.service';

@Injectable({ providedIn: 'root' })
export class ResourcesService implements OnDestroy {
  private subList: SubscriptionObject[] = [];
  private appTitle = LocalConfig.BrandName;
  public brandName = LocalConfig.BrandName;
  public breadcrums: any[];
  public defaultBreadcrums: any[];
  public currentUrl: string;
  public resourceRequest: ResourceRequest;
  public accessDetails: IMenuItem;
  public resourceSubject: BehaviorSubject<ResourceRequest>;

  constructor(
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private navigationService: NavigationService
  ) {
    this.title.setTitle(this.appTitle);
    this.getAccessDetails();
    pushSubscription(
      'RouterEvents',
      this.subList,
      router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((routeChange: NavigationEnd) => {
          this.currentUrl = this.router.url;
          this.checkRedirection();
          this.getAccessDetails();
          this.getBredcrumb();
        })
    );
  }

  public checkRedirection(): void {
    if (this.currentUrl === '' || this.currentUrl === '/') {
      this.navigateToDash();
    }
  }

  public navigateToDash(): void {
    let redirectionPage = '';
    const menuList: IMenuItem[] = this.navigationService.getNavigationList();
    if (menuList && menuList.length) {
      const filterList = menuList
        .sort((d) => d.id)
        .filter(
          (menu) =>
            menu.childItems.length > 0 &&
            menu.childItems.filter((submenu) => submenu.type === PageType.Dash)
        );
      if (filterList.length > 0) {
        redirectionPage = `${filterList[0].state}/${filterList[0].childItems[0].state}`;
      } else {
        redirectionPage = menuList.filter((menu) => menu.childItems != null)[0]
          .childItems[0].state;
      }
      this.router.navigateByUrl(redirectionPage);
    } else {
      setTimeout(() => this.navigateToDash(), 500);
    }
  }

  public navigateToPage(url?: string): void {
    this.router.navigateByUrl(
      url ? url : this.currentUrl ? this.currentUrl : ''
    );
  }

  private getAccessDetails(): void {
    this.resourceRequest = this.getFormFromUrl(
      this.activatedRoute,
      this.router.url
    );
    this.accessDetails = this.navigationService.getAccessDetails(
      this.resourceRequest.resourceName
    );
    if (!this.resourceSubject) {
      this.resourceSubject = new BehaviorSubject<ResourceRequest>(
        this.resourceRequest
      );
    } else {
      this.resourceSubject.next(this.resourceRequest);
    }
  }

  private getBredcrumb(): void {
    this.breadcrums = [];
    if (this.resourceRequest && this.resourceRequest.moduleName) {
      const module = this.navigationService.menuItems.find(
        (d) => d.state === this.resourceRequest.moduleName
      );
      if (module) {
        this.breadcrums.push(module.name);
        this.title.setTitle(module.name);

        if (this.resourceRequest.resourceName) {
          const subMoule = module.childItems.find(
            (d) => d.state === this.resourceRequest.resourceName
          );
          if (subMoule) {
            this.breadcrums.push(subMoule.name);
            this.title.setTitle(`${module.name} | ${subMoule.name}`);
          }
        }
      }
    }
    this.defaultBreadcrums = JSON.parse(JSON.stringify(this.breadcrums));
  }

  public addToBreadcrumb(items: string[]): void {
    this.breadcrums = JSON.parse(JSON.stringify(this.defaultBreadcrums));
    if (items) {
      this.breadcrums = this.breadcrums.concat(items);
    }
  }

  private getFormFromUrl(
    activatedRoute: ActivatedRoute,
    url?: string
  ): ResourceRequest {
    const resourceRequest: ResourceRequest = {
      moduleName: '',
      resourceName: '',
    };
    const data = activatedRoute.snapshot.url[0]
      ? activatedRoute.snapshot.url[0].path
      : '';
    if (!data) {
      const path = url.split('/');
      if (path.length > 1) {
        if (path[0] === '') {
          resourceRequest.moduleName = path[1];
          resourceRequest.resourceName = path[2];
        } else {
          resourceRequest.moduleName = path[0];
          resourceRequest.resourceName = path[1];
        }
      }
    } else {
      resourceRequest.resourceName = data;
      resourceRequest.moduleName = activatedRoute.snapshot.parent.url.length
        ? activatedRoute.snapshot.parent.url[0].path
        : '';
    }
    return resourceRequest;
  }

  ngOnDestroy(): void {
    destroySubscriptions(this.subList);
  }
}
