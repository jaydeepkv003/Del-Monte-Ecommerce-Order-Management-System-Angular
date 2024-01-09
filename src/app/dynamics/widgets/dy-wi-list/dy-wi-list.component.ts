import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { ListTileOption, WidgetConfig } from '@dynamics/dynamics.interface';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from '@services/subscriber.service';
import { WidgetDynamicService } from '@services/widget.dynamic.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-wi-list',
  templateUrl: './dy-wi-list.component.html',
  styleUrls: ['./dy-wi-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WidgetDynamicService],
})
export class DyWiListComponent implements OnDestroy {
  widgetConfig: WidgetConfig;
  private subList: SubscriptionObject[] = [];

  @Input() set config(widget: WidgetConfig) {
    if (widget && widget.isActive) {
      this.widgetConfig = widget;
      this.wiService.configure(widget);
    }
  }

  constructor(
    public wiService: WidgetDynamicService<ListTileOption[]>,
    private changeDetector: ChangeDetectorRef
  ) {
    this.wiService.changeDetector = changeDetector;
    this.eventSubscribe();
  }

  eventSubscribe(): void {
    pushSubscription(
      'LiveListData',
      this.subList,
      this.wiService.messageSubject.subscribe((message) => {
        if (message) {
          this.wiService.processData();
        }
      })
    );
  }

  ngOnDestroy(): void {
    destroySubscriptions(this.subList);
  }
}
