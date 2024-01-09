import { ChangeDetectorRef, Injectable, OnDestroy } from '@angular/core';
import { WidgetOptionType } from '@dynamics/dynamics.enum';
import {
  TcpMessage,
  WidgetConfig,
  WidgetOptions,
} from '@dynamics/dynamics.interface';
import { Urls } from '@urls';
import { Subject } from 'rxjs';
import { DataService } from './data.service';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from './subscriber.service';
import { WidgetMessageService } from './widget.message.service';

@Injectable()
export class WidgetDynamicService<T> implements OnDestroy {
  private subList: SubscriptionObject[] = [];

  private widgetConfig: WidgetConfig;
  public widgetData: T = null;
  public WidgetOptionType = WidgetOptionType;

  public changeDetector: ChangeDetectorRef;

  dataSubject: Subject<any> = new Subject();
  messageSubject: Subject<TcpMessage> = new Subject();

  constructor(
    private widgetMessageService: WidgetMessageService,
    public dataService: DataService
  ) {}

  configure(config: WidgetConfig): void {
    this.widgetConfig = config;
    this.processData();
    this.processMessages();
  }

  processData(): void {
    if (this.widgetConfig && this.widgetConfig.isDataWidget) {
      const dataUrl = this.widgetConfig.isInternalUrl
        ? `${Urls.Base}${this.widgetConfig.dataUrl}`
        : this.widgetConfig.dataUrl;
      this.dataService.postData<T>(dataUrl).then((data) => {
        this.widgetData = data;
        this.dataSubject.next(data);
        this.detectChanges();
      });
    }
  }

  processMessages(): void {
    if (this.widgetConfig && this.widgetConfig.isLive) {
      pushSubscription(
        'TCPMessages',
        this.subList,
        this.widgetMessageService.messageSubject.subscribe((message) => {
          if (
            message &&
            message.widgetMessageType === this.widgetConfig.widgetMessageType
          ) {
            this.messageSubject.next(message);
          }
          this.detectChanges();
        })
      );
    }
  }

  getFieldValue(options: WidgetOptions[], name: string): string {
    return options && options.length
      ? options.find((d) => d.keyField === name)?.valueField
      : '';
  }

  getOptionValue(name: string): any {
    return this.widgetConfig.widgetOptions &&
      this.widgetConfig.widgetOptions.length
      ? this.widgetConfig.widgetOptions.find((d) => d.keyField === name)
          ?.valueField
      : '';
  }

  getWidgetData(name: string): string {
    const propertyName = this.getFieldValue(
      this.widgetConfig.widgetOptions,
      name
    );
    return this.widgetData[propertyName]
      ? `${this.widgetData[propertyName]}`
      : '';
  }

  detectChanges(): void {
    if (this.changeDetector) {
      this.changeDetector.detectChanges();
    }
  }

  ngOnDestroy(): void {
    destroySubscriptions(this.subList);
  }
}
