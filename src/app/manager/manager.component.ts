import { Component, OnDestroy } from '@angular/core';
import { PageType } from '@dynamics/dynamics.constants';
import { DashboardService } from '@services/dashboard.service';
import { ResourcesService } from '@services/resources.service';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from '@services/subscriber.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
})
export class ManagerComponent implements OnDestroy {
  PageTypes: any = PageType;
  private subList: SubscriptionObject[] = [];
  currentPageType: string = this.PageTypes.Crud;

  constructor(
    private resourcesService: ResourcesService,
    private dashboardService: DashboardService
  ) {
    pushSubscription(
      'ManagerResource',
      this.subList,
      this.resourcesService.resourceSubject.subscribe(() => {
        this.currentPageType =
          this.resourcesService.accessDetails &&
          this.resourcesService.accessDetails.pageType
            ? this.resourcesService.accessDetails.pageType
            : PageType.Crud;
        if (
          this.dashboardService.isFullScreenDash &&
          this.currentPageType !== PageType.Dash
        ) {
          this.dashboardService.isFullScreenDash = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    destroySubscriptions(this.subList);
  }
}
