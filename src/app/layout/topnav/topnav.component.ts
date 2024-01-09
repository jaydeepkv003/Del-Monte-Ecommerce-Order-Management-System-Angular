import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ResourceRequest } from '@dynamics/dynamics.interface';
import { DyFormPopupComponent } from '@dynamics/forms/dy-form-popup/dy-form-popup.component';
import { AuthService } from '@services/auth.service';
import { PopupService } from '@services/popup.service';
import { ISidebar, SidebarService } from '@services/sidebar.service';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from '@services/subscriber.service';
import { TranslationsService } from '@services/translations.service';
import { getThemeColor, setThemeColor } from '@services/utiltiy.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  providers: [PopupService],
})
export class TopnavComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('formPopup', { static: true }) formPopup: DyFormPopupComponent;
  private subList: SubscriptionObject[] = [];
  resourceRequest: ResourceRequest = {
    moduleName: 'Auth',
    resourceName: 'PasswordChange',
  };

  sidebar: ISidebar;
  currentLanguage: string;
  isSingleLang = true;
  isFullScreen = false;
  isDarkModeActive = false;
  searchKey = '';
  username = localStorage.UserName;

  constructor(
    private sidebarService: SidebarService,
    public popupServide: PopupService,
    public authService: AuthService,
    public translationsService: TranslationsService
  ) {
    this.isDarkModeActive = getThemeColor().indexOf('dark') > -1 ? true : false;
  }

  onDarkModeChange(event): void {
    let color = getThemeColor();
    if (color.indexOf('dark') > -1) {
      color = color.replace('dark', 'light');
    } else if (color.indexOf('light') > -1) {
      color = color.replace('light', 'dark');
    }
    setThemeColor(color);
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }

  fullScreenClick(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  ngOnInit(): void {
    pushSubscription(
      'SidebarSub',
      this.subList,
      this.sidebarService.getSidebar().subscribe((res) => (this.sidebar = res))
    );
  }

  ngAfterViewInit(): void {
    this.popupServide.formPopup = this.formPopup;
  }

  menuButtonClick(
    e: { stopPropagation: () => void },
    menuClickCount: number,
    containerClassnames: string
  ): any {
    if (e) {
      e.stopPropagation();
    }

    setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', false, false);
      window.dispatchEvent(event);
    }, 350);

    this.sidebarService.setContainerClassnames(
      ++menuClickCount,
      containerClassnames,
      this.sidebar.selectedMenuHasSubItems
    );
  }

  mobileMenuButtonClick(
    event: { stopPropagation: () => void },
    containerClassnames: string
  ): void {
    if (event) {
      event.stopPropagation();
    }
    this.sidebarService.clickOnMobileMenu(containerClassnames);
  }

  searchKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.search();
    } else if (event.key === 'Escape') {
      const input = document.querySelector('.mobile-view');
      if (input && input.classList) {
        input.classList.remove('mobile-view');
      }
      this.searchKey = '';
    }
  }

  searchAreaClick(event): void {
    event.stopPropagation();
  }

  searchClick(event): void {
    if (window.innerWidth < environment.menuHiddenBreakpoint) {
      let elem = event.target;
      if (!event.target.classList.contains('search')) {
        if (event.target.parentElement.classList.contains('search')) {
          elem = event.target.parentElement;
        } else if (
          event.target.parentElement.parentElement.classList.contains('search')
        ) {
          elem = event.target.parentElement.parentElement;
        }
      }

      if (elem.classList.contains('mobile-view')) {
        this.search();
        elem.classList.remove('mobile-view');
      } else {
        elem.classList.add('mobile-view');
      }
    } else {
      this.search();
    }
    event.stopPropagation();
  }

  search(): void {
    if (this.searchKey && this.searchKey.length > 1) {
      // this.router.navigate([this.adminRoot + '/pages/miscellaneous/search'], {
      //   queryParams: { key: this.searchKey.toLowerCase().trim() },
      // });
      // this.searchKey = '';
    }
  }

  reloadPanel(): void {
    this.authService.reloadUser();
    this.translationsService.relodeTranslation();
  }

  @HostListener('document:fullscreenchange', ['$event'])
  handleFullscreen(event): void {
    if (document.fullscreenElement) {
      this.isFullScreen = true;
    } else {
      this.isFullScreen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event): void {
    const input = document.querySelector('.mobile-view');
    if (input && input.classList) {
      input.classList.remove('mobile-view');
    }
    this.searchKey = '';
  }

  ngOnDestroy(): void {
    destroySubscriptions(this.subList);
  }
}
