import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IMenuItem } from '@dynamics/dynamics.interface';
import { NavigationService } from '@services/navigation.service';
import { ISidebar, SidebarService } from '@services/sidebar.service';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from '@services/subscriber.service';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit, OnDestroy {
  private subList: SubscriptionObject[] = [];
  selectedParentMenu = '';
  viewingParentMenu = '';
  currentUrl: string;
  urlParts: string[];

  sidebar: ISidebar;
  closedCollapseList = [];

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event): void {
    this.viewingParentMenu = '';
    this.selectMenu();
    this.toggle();
  }

  @HostListener('window:resize', ['$event'])
  handleWindowResize(event): void {
    if (event && !event.isTrusted) {
      return;
    }
    const { containerClassnames } = this.sidebar;
    const nextClasses = this.getMenuClassesForResize(containerClassnames);
    this.sidebarService.setContainerClassnames(
      0,
      nextClasses.join(' '),
      this.sidebar.selectedMenuHasSubItems
    );
    this.isCurrentMenuHasSubItem();
  }

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private activatedRoute: ActivatedRoute,
    public navigationService: NavigationService
  ) {
    pushSubscription(
      'SidebarSub',
      this.subList,
      this.sidebarService.getSidebar().subscribe(
        (res) => (this.sidebar = res),
        (err) => console.error(`An error occurred: ${err.message}`)
      )
    );
    pushSubscription(
      'NavigationSub',
      this.subList,
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          map(() => this.activatedRoute),
          map((route) => {
            while (route.firstChild) {
              route = route.firstChild;
            }
            return route;
          })
        )
        .subscribe((event) => {
          const path = this.router.url.split('?')[0];
          const paramtersLen = Object.keys(event.snapshot.params).length;
          const pathArr = path
            .split('/')
            .slice(0, path.split('/').length - paramtersLen);
          this.currentUrl = pathArr.join('/');
        })
    );
    pushSubscription(
      'NavigationNavMenu',
      this.subList,
      router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          const { containerClassnames } = this.sidebar;
          this.selectMenu();
          this.toggle();
          this.sidebarService.setContainerClassnames(
            0,
            containerClassnames,
            this.sidebar.selectedMenuHasSubItems
          );
          window.scrollTo(0, 0);
        })
    );
  }

  async ngOnInit(): Promise<void> {
    setTimeout(() => {
      this.selectMenu();
      const { containerClassnames } = this.sidebar;
      const nextClasses = this.getMenuClassesForResize(containerClassnames);
      this.sidebarService.setContainerClassnames(
        0,
        nextClasses.join(' '),
        this.sidebar.selectedMenuHasSubItems
      );
      this.isCurrentMenuHasSubItem();
    }, 100);
  }

  selectMenu(): void {
    if (this.currentUrl) {
      this.urlParts = this.currentUrl.split('/');
      if (!this.urlParts[0]) {
        this.urlParts.splice(0, 1);
      }
      this.selectedParentMenu = this.urlParts[0];
      this.isCurrentMenuHasSubItem();
    }
  }

  findParentInPath(path): any {
    const foundedMenuItem = this.navigationService.menuItems.find(
      (x) => x.state === path
    );
    if (!foundedMenuItem) {
      if (path.split('/').length > 1) {
        const pathArr = path.split('/');
        return this.findParentInPath(
          pathArr.slice(0, pathArr.length - 1).join('/')
        );
      } else {
        return undefined;
      }
    } else {
      return path;
    }
  }

  isCurrentMenuHasSubItem(): boolean {
    const { containerClassnames } = this.sidebar;

    const menuItem = this.navigationService.menuItems.find(
      (x) => x.state === this.selectedParentMenu
    );
    const isCurrentMenuHasSubItem =
      menuItem && menuItem.childItems && menuItem.childItems.length > 0
        ? true
        : false;
    if (isCurrentMenuHasSubItem !== this.sidebar.selectedMenuHasSubItems) {
      if (!isCurrentMenuHasSubItem) {
        this.sidebarService.setContainerClassnames(
          0,
          containerClassnames,
          false
        );
      } else {
        this.sidebarService.setContainerClassnames(
          0,
          containerClassnames,
          true
        );
      }
    }
    return isCurrentMenuHasSubItem;
  }

  changeSelectedParentHasNoSubmenu(parentMenu: string): void {
    const { containerClassnames } = this.sidebar;
    this.selectedParentMenu = parentMenu;
    this.viewingParentMenu = parentMenu;
    this.sidebarService.changeSelectedMenuHasSubItems(false);
    this.sidebarService.setContainerClassnames(0, containerClassnames, false);
  }

  openSubMenu(
    event: { stopPropagation: () => void },
    menuItem: IMenuItem
  ): any {
    if (event) {
      event.stopPropagation();
    }
    const { containerClassnames, menuClickCount } = this.sidebar;

    const selectedParent = menuItem.state;
    const hasSubMenu = menuItem.childItems && menuItem.childItems.length > 0;
    this.sidebarService.changeSelectedMenuHasSubItems(hasSubMenu);
    if (!hasSubMenu) {
      this.viewingParentMenu = selectedParent;
      this.selectedParentMenu = selectedParent;
      this.toggle();
    } else {
      const currentClasses = containerClassnames
        ? containerClassnames.split(' ').filter((x) => x !== '')
        : '';

      if (!currentClasses.includes('menu-mobile')) {
        if (
          currentClasses.includes('menu-sub-hidden') &&
          (menuClickCount === 2 || menuClickCount === 0)
        ) {
          this.sidebarService.setContainerClassnames(
            3,
            containerClassnames,
            hasSubMenu
          );
        } else if (
          currentClasses.includes('menu-hidden') &&
          (menuClickCount === 1 || menuClickCount === 3)
        ) {
          this.sidebarService.setContainerClassnames(
            2,
            containerClassnames,
            hasSubMenu
          );
        } else if (
          currentClasses.includes('menu-default') &&
          !currentClasses.includes('menu-sub-hidden') &&
          (menuClickCount === 1 || menuClickCount === 3)
        ) {
          this.sidebarService.setContainerClassnames(
            0,
            containerClassnames,
            hasSubMenu
          );
        }
      } else {
        this.sidebarService.addContainerClassname(
          'sub-show-temporary',
          containerClassnames
        );
      }
      this.viewingParentMenu = selectedParent;
    }
  }

  toggle(): void {
    const { containerClassnames, menuClickCount } = this.sidebar;
    const currentClasses = containerClassnames
      .split(' ')
      .filter((x) => x !== '');
    if (currentClasses.includes('menu-sub-hidden') && menuClickCount === 3) {
      this.sidebarService.setContainerClassnames(
        2,
        containerClassnames,
        this.sidebar.selectedMenuHasSubItems
      );
    } else if (
      currentClasses.includes('menu-hidden') ||
      currentClasses.includes('menu-mobile')
    ) {
      if (!(menuClickCount === 1 && !this.sidebar.selectedMenuHasSubItems)) {
        this.sidebarService.setContainerClassnames(
          0,
          containerClassnames,
          this.sidebar.selectedMenuHasSubItems
        );
      }
    }
  }

  toggleCollapse(id: string): void {
    if (this.closedCollapseList.includes(id)) {
      this.closedCollapseList = this.closedCollapseList.filter((x) => x !== id);
    } else {
      this.closedCollapseList.push(id);
    }
  }

  getMenuClassesForResize(classes: string): string[] {
    let nextClasses = classes.split(' ').filter((x: string) => x !== '');
    const windowWidth = window.innerWidth;

    if (windowWidth < this.sidebarService.menuHiddenBreakpoint) {
      nextClasses.push('menu-mobile');
    } else if (windowWidth < this.sidebarService.subHiddenBreakpoint) {
      nextClasses = nextClasses.filter((x: string) => x !== 'menu-mobile');
      if (
        nextClasses.includes('menu-default') &&
        !nextClasses.includes('menu-sub-hidden')
      ) {
        nextClasses.push('menu-sub-hidden');
      }
    } else {
      nextClasses = nextClasses.filter((x: string) => x !== 'menu-mobile');
      if (
        nextClasses.includes('menu-default') &&
        nextClasses.includes('menu-sub-hidden')
      ) {
        nextClasses = nextClasses.filter(
          (x: string) => x !== 'menu-sub-hidden'
        );
      }
    }
    return nextClasses;
  }

  menuClicked(e: MouseEvent): void {
    e.stopPropagation();
  }

  filteredMenuItems(menuItems: IMenuItem[]): IMenuItem[] {
    return menuItems;
  }

  ngOnDestroy(): void {
    destroySubscriptions(this.subList);
  }
}
