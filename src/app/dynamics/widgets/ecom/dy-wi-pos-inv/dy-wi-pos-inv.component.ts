import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ComponentTypes, eExceptions } from '@dynamics/dynamics.constants';
import { WidgetOptionType } from '@dynamics/dynamics.enum';
import { FormConfig, WidgetConfig } from '@dynamics/dynamics.interface';
import { DyFormPopupComponent } from '@dynamics/forms/dy-form-popup/dy-form-popup.component';
import { DyCodeScanPopupComponent } from '@dynamics/popups/dy-code-scan-popup/dy-code-scan-popup.component';
import { DyDocumentPopupComponent } from '@dynamics/popups/dy-document-popup/dy-document-popup.component';
import { DyInputPopupComponent } from '@dynamics/popups/dy-input-popup/dy-input-popup.component';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from '@services/subscriber.service';
import { WidgetDynamicService } from '@services/widget.dynamic.service';
import { Modules, Urls } from '@urls';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-wi-pos-inv',
  templateUrl: './dy-wi-pos-inv.component.html',
  styleUrls: ['./dy-wi-pos-inv.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WidgetDynamicService],
})
export class DyWiPosInvComponent implements OnDestroy {
  @ViewChild('skuButtons', { static: true }) skuButtons: TemplateRef<any>;
  @ViewChild('formPopup', { static: true }) formPopup: DyFormPopupComponent;
  @ViewChild('csPopup', { static: true }) csPopup: DyCodeScanPopupComponent;
  @ViewChild('inPopup', { static: true }) inPopup: DyInputPopupComponent;
  @ViewChild('docPopup', { static: true }) docPopup: DyDocumentPopupComponent;

  widgetConfig: WidgetConfig;
  modelRef: BsModalRef;
  searchKey = '';
  localData = [];
  premises = [];
  cartTotal = 0;
  firstStep = true;

  selectedProduct: any;
  selectedPremise: any;
  skuFormConfig: FormConfig;
  stockUM = StockUpdateMethods;

  private subList: SubscriptionObject[] = [];

  @Input() set config(widget: WidgetConfig) {
    if (widget && widget.isActive) {
      this.widgetConfig = widget;
      this.wiService.configure(widget);
    }
  }

  constructor(
    public wiService: WidgetDynamicService<any>,
    private changeDetector: ChangeDetectorRef,
    private modalService: BsModalService
  ) {
    this.wiService.changeDetector = changeDetector;
    pushSubscription(
      'WiData',
      this.subList,
      wiService.dataSubject.subscribe((data) => (this.localData = data))
    );
  }

  searchKeyUp(): void {
    if (this.searchKey) {
      const val = this.searchKey.toLowerCase().trim();
      const filterData = this.wiService.widgetData.filter((item) => {
        if (
          !val ||
          (item.name && item.name.toString().toLowerCase().indexOf(val) !== -1)
        ) {
          return true;
        }
      });
      this.localData = filterData;
    } else {
      this.localData = this.wiService.widgetData;
    }
    this.wiService.detectChanges();
  }

  onSkuSelect(product): void {
    this.selectedProduct = product;
    this.modelRef = this.modalService.show(this.skuButtons, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-right',
    });
    pushSubscription(
      'SkuPopup',
      this.subList,
      this.modelRef.onHide.subscribe(() => {
        this.wiService.processData();
      })
    );
  }

  onSkuUpdate(): void {
    if (!this.skuFormConfig) {
      const resourceRequest = {
        resourceName: this.wiService.getFieldValue(
          this.widgetConfig.widgetOptions,
          WidgetOptionType.PrimaryForm
        ),
      };
      if (resourceRequest && resourceRequest.resourceName) {
        this.wiService.dataService
          .postData<FormConfig>(Urls.Forms.GetForm, resourceRequest)
          .then((response) => {
            this.skuFormConfig = new FormConfig();
            this.skuFormConfig = response;
            this.onSkuFormOpen();
          });
      }
    } else {
      this.onSkuFormOpen();
    }
  }

  onSkuFormOpen(): void {
    if (this.skuFormConfig && this.skuFormConfig.properties) {
      this.formPopup.show({
        formConfig: this.skuFormConfig,
        formData: this.selectedProduct.defaultSku,
      });
      pushSubscription(
        'SkuSubmit',
        this.subList,
        this.formPopup.submit.subscribe(() => {
          this.wiService.processData();
        })
      );
    }
  }

  onStockUpdate(): void {
    const dataUrl = this.wiService.getFieldValue(
      this.widgetConfig.widgetOptions,
      WidgetOptionType.PrimaryUrl
    );
    if (dataUrl) {
      this.wiService.dataService
        .postData<any>(Modules.Base + dataUrl, {
          skuId: this.selectedProduct.defaultSku.id,
        })
        .then((data) => {
          this.premises = data;
          this.firstStep = false;
        });
    }
  }

  generateStock(stockUpload: StockUpload): void {
    const dataUrl = this.wiService.getFieldValue(
      this.widgetConfig.widgetOptions,
      WidgetOptionType.SaveUrl
    );
    if (dataUrl) {
      this.wiService.dataService
        .post<any>(Modules.Base + dataUrl, stockUpload)
        .then((data) => {
          if (data.status === eExceptions.Success) {
            this.onStockUpdate();
            this.docPopup.show(data.data);
          }
        });
    }
  }

  premiseStockUpdate(premise, type): void {
    this.selectedPremise = premise;
    const stockUpload: StockUpload = {
      skuId: this.selectedProduct.defaultSku.id,
      premiseId: this.selectedPremise.id,
    };
    switch (type) {
      case this.stockUM.Scan:
        this.csPopup.show();
        pushSubscription(
          'Code',
          this.subList,
          this.csPopup.submit.subscribe((codes) => {
            if (codes && codes.length) {
              this.generateStock({ ...stockUpload, scannedCode: codes });
            }
          })
        );
        break;
      case this.stockUM.GenerateQR:
        this.inPopup.openModal(
          'Enter number of Code you want to generate.',
          ComponentTypes.Number.toLowerCase()
        );
        pushSubscription(
          'Code',
          this.subList,
          this.inPopup.submit.subscribe((qty) => {
            if (qty) {
              this.generateStock({ ...stockUpload, generateCode: qty });
            }
          })
        );
        break;
      default:
        this.inPopup.openModal(
          'Enter number of Quantity you want to add.',
          ComponentTypes.Number.toLowerCase()
        );
        pushSubscription(
          'Code',
          this.subList,
          this.inPopup.submit.subscribe((qty) => {
            if (qty) {
              this.generateStock({ ...stockUpload, addQuantity: qty });
            }
          })
        );
        break;
    }
  }

  ngOnDestroy(): void {
    destroySubscriptions(this.subList);
  }
}

export enum StockUpdateMethods {
  Scan = 'Scan',
  GenerateQR = 'GenerateQR',
  Directly = 'Directly',
}

export class StockUpload {
  skuId: number;
  premiseId: number;
  generateCode?: string;
  addQuantity?: string;
  scannedCode?: string[];
}
