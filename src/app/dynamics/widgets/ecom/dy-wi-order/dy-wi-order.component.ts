import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { eExceptions } from '@dynamics/dynamics.constants';
import { OrderState, WidgetOptionType } from '@dynamics/dynamics.enum';
import {
  FormConfig,
  ResourceRequest,
  WidgetConfig,
} from '@dynamics/dynamics.interface';
import { DyFormPopupComponent } from '@dynamics/forms/dy-form-popup/dy-form-popup.component';
import { DyCodeScanPopupComponent } from '@dynamics/popups/dy-code-scan-popup/dy-code-scan-popup.component';
import { DyConfirmPopupComponent } from '@dynamics/popups/dy-confirm-popup/dy-confirm-popup.component';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from '@services/subscriber.service';
import { WidgetDynamicService } from '@services/widget.dynamic.service';
import { Modules } from '@urls';

@Component({
  selector: 'app-dy-wi-order',
  templateUrl: './dy-wi-order.component.html',
  styleUrls: ['./dy-wi-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WidgetDynamicService],
})
export class DyWiOrderComponent implements OnDestroy {
  @ViewChild('csPopup', { static: true }) csPopup: DyCodeScanPopupComponent;
  @ViewChild('formPopup', { static: true }) formPopup: DyFormPopupComponent;
  @ViewChild('confPopup', { static: true }) confPopup: DyConfirmPopupComponent;

  widgetConfig: WidgetConfig;
  private subList: SubscriptionObject[] = [];
  request: ResourceRequest;
  OrderState = OrderState;
  formConfig: FormConfig;
  edititngOrder: any;
  newOrder = false;

  @Input() set config(widget: WidgetConfig) {
    if (widget && widget.isActive) {
      this.widgetConfig = widget;
      this.wiService.configure(widget);
    }
  }

  constructor(
    public wiService: WidgetDynamicService<any>,
    private changeDetector: ChangeDetectorRef
  ) {
    this.wiService.changeDetector = changeDetector;
    this.eventSubscribe();
  }

  processOrder(order: any): void {
    this.newOrder = order.orderStatus === OrderState.New;
    this.edititngOrder = order;
  }

  getStockData(sku: any): void {
    this.csPopup.show(sku.scannedCode, sku.quantity, false);
    pushSubscription(
      'ReduceStock',
      this.subList,
      this.csPopup.submit.subscribe((codes: []) => (sku.scannedCode = codes))
    );
  }

  saveStockReduce(): void {
    let isValid = true;
    const postData = [];
    this.edititngOrder.skus.forEach((sku) => {
      if (isValid && sku.scannedCode !== sku.quantity) {
        isValid = false;
      }
      postData.push({
        OrderId: this.edititngOrder.id,
        SkuId: sku.id,
        ScannedCode: sku.scannedCode,
      });
    });

    if (!isValid) {
      this.confPopup.openModal(
        'Are you sure? You want to Continue without stock balance?'
      );
      pushSubscription(
        'ProcessWithoutStock',
        this.subList,
        this.confPopup.confirmation.subscribe((flag) => {
          if (flag) {
            const dataUrl = this.wiService.getFieldValue(
              this.widgetConfig.widgetOptions,
              WidgetOptionType.SecondaryUrl
            );
            if (dataUrl) {
              this.wiService.dataService
                .post(Modules.Base + dataUrl, postData)
                .then((resp) => {
                  if (resp.status === eExceptions.Success) {
                    this.wiService.processData();
                    this.reloadLoags();
                    this.newOrder = false;
                  }
                });
            }
          }
        })
      );
    }
  }

  processStep(): void {
    if (!this.formConfig) {
      this.request = {
        resourceName: this.wiService.getFieldValue(
          this.widgetConfig.widgetOptions,
          WidgetOptionType.PrimaryForm
        ),
      };
      const primaryUrl = this.wiService.getFieldValue(
        this.widgetConfig.widgetOptions,
        WidgetOptionType.PrimaryUrl
      );
      if (this.request.resourceName && primaryUrl) {
        this.wiService.dataService
          .postData<FormConfig>(Modules.Base + primaryUrl, this.request)
          .then((response) => {
            this.formConfig = new FormConfig();
            this.formConfig = response;
            this.onFormOpen();
          });
      }
    } else {
      this.onFormOpen();
    }
  }

  onFormOpen(): void {
    this.formPopup.show({
      formConfig: { ...this.formConfig, isSubForm: true },
      parentData: { Data: this.edititngOrder.id },
    });
    pushSubscription(
      'DataSub',
      this.subList,
      this.formPopup.submit.subscribe(() => {
        this.reloadLoags();
      })
    );
  }

  reloadLoags(): void {
    const dataUrl = this.wiService.getFieldValue(
      this.widgetConfig.widgetOptions,
      WidgetOptionType.SubUrl
    );
    if (dataUrl) {
      this.wiService.dataService
        .postData(Modules.Base + dataUrl, { data: this.edititngOrder.id })
        .then((response: any[]) => {
          if (response && response.length) {
            this.wiService.widgetData
              .filter((d) => d.id === this.edititngOrder.id)
              .forEach((order: any) => {
                order.logs = response;
                order.orderStatus = response[response.length - 1].orderStatus;
              });
            this.edititngOrder.logs = response;
            this.wiService.detectChanges();
          }
        });
    }
  }

  eventSubscribe(): void {
    pushSubscription(
      'LiveBarData',
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
