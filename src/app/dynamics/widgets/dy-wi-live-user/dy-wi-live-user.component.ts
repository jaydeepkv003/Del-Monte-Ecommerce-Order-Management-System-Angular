import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { eMessageType } from '@dynamics/dynamics.constants';
import { WidgetConfig } from '@dynamics/dynamics.interface';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from '@services/subscriber.service';
import { WidgetDynamicService } from '@services/widget.dynamic.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-wi-live-user',
  templateUrl: './dy-wi-live-user.component.html',
  styleUrls: ['./dy-wi-live-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WidgetDynamicService],
})
export class DyWiLiveUserComponent implements OnDestroy {
  widgetConfig: WidgetConfig;
  private subList: SubscriptionObject[] = [];

  @Input() set config(widget: WidgetConfig) {
    if (widget && widget.isActive) {
      this.widgetConfig = widget;
      this.wiService.configure(widget);
    }
  }

  constructor(
    public wiService: WidgetDynamicService<LiveUsers[]>,
    private changeDetector: ChangeDetectorRef
  ) {
    this.wiService.changeDetector = changeDetector;
    this.eventSubscribe();
  }

  eventSubscribe(): void {
    pushSubscription(
      'LiveUsers',
      this.subList,
      this.wiService.messageSubject.subscribe((message) => {
        if (message && message.data && this.wiService.widgetData) {
          const newData = message.data as LiveUsers[];
          newData.forEach((user) => {
            const updateUser = this.wiService.widgetData.find(
              (d) => d.id === user.id
            );
            if (updateUser) {
              if (updateUser.sessions !== user.sessions) {
                this.wiService.dataService.notify(
                  `${user.username} is ${
                    user.sessions > updateUser.sessions
                      ? 'now online'
                      : 'now offline'
                  }`,
                  eMessageType.Info
                );
              }
            }
            this.wiService.widgetData.find((d) => d.id === user.id).sessions =
              user.sessions;
            this.wiService.widgetData.find((d) => d.id === user.id).isOnline =
              user.isOnline;
          });
        }
        this.wiService.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    destroySubscriptions(this.subList);
  }
}
export class LiveUsers {
  id?: number;
  username?: string;
  sessions?: number;
  isOnline?: boolean;
}
