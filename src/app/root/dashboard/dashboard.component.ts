import { AfterViewInit, Component, OnDestroy, Renderer2 } from '@angular/core';
import { DashboardService } from '@services/dashboard.service';
import { ISidebar, SidebarService } from '@services/sidebar.service';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from '@services/subscriber.service';
import { TranslationsService } from '@services/translations.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnDestroy, AfterViewInit {
  private subList: SubscriptionObject[] = [];
  isMultiColorActive = environment.isMultiColorActive;
  sidebar: ISidebar;

  constructor(
    private renderer: Renderer2,
    private sidebarService: SidebarService,
    public dashboardService: DashboardService,
    public translationsService: TranslationsService
  ) {
    pushSubscription(
      'DashSidebar',
      this.subList,
      this.sidebarService.getSidebar().subscribe(
        (res) => (this.sidebar = res),
        (err) => console.error(`An error occurred: ${err.message}`)
      )
    );
    this.dashboardService.loadNavigations();
    translationsService.relodeTranslation();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderer.addClass(document.body, 'show');
    }, 1000);
    setTimeout(() => {
      this.renderer.addClass(document.body, 'default-transition');
    }, 1500);
  }

  ngOnDestroy(): void {
    destroySubscriptions(this.subList);
  }
}
