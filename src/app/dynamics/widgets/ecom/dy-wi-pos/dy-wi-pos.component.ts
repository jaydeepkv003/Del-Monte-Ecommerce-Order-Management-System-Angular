import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ComponentTypes,
  eExceptions,
  eMessageType,
} from '@dynamics/dynamics.constants';
import { WidgetOptionType } from '@dynamics/dynamics.enum';
import {
  FormConfig,
  ResourceRequest,
  WidgetConfig,
} from '@dynamics/dynamics.interface';
import { DyCodeScanPopupComponent } from '@dynamics/popups/dy-code-scan-popup/dy-code-scan-popup.component';
import { DyDocumentPopupComponent } from '@dynamics/popups/dy-document-popup/dy-document-popup.component';
import { DyInputPopupComponent } from '@dynamics/popups/dy-input-popup/dy-input-popup.component';
import { GlobalConfigService } from '@services/global.service';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from '@services/subscriber.service';
import { WidgetDynamicService } from '@services/widget.dynamic.service';
import { Modules } from '@urls';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DyCustPopupComponent } from './dy-cust-popup/dy-cust-popup.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-wi-pos',
  templateUrl: './dy-wi-pos.component.html',
  styleUrls: ['./dy-wi-pos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WidgetDynamicService],
})
export class DyWiPosComponent implements OnDestroy {
  @ViewChild('skuButtons', { static: true }) skuButtons: TemplateRef<any>;
  @ViewChild('csPopup', { static: true }) csPopup: DyCodeScanPopupComponent;
  @ViewChild('custPopup', { static: true }) custPopup: DyCustPopupComponent;
  @ViewChild('inPopup', { static: true }) inPopup: DyInputPopupComponent;
  @ViewChild('docPopup', { static: true }) docPopup: DyDocumentPopupComponent;

  widgetConfig: WidgetConfig;
  modelRef: BsModalRef;
  searchKey = '';
  localData = [];
  cartList: CartProduct[] = [];
  cartDiscount = 0;
  cartTotal = 0;
  private subList: SubscriptionObject[] = [];

  request: ResourceRequest;
  formConfig: FormConfig;
  customer: any;

  @Input() set config(widget: WidgetConfig) {
    if (widget && widget.isActive) {
      this.widgetConfig = widget;
      this.wiService.configure(widget);
    }
  }

  constructor(
    public wiService: WidgetDynamicService<any>,
    public modalService: BsModalService,
    private changeDetector: ChangeDetectorRef,
    public gcService: GlobalConfigService
  ) {
    this.wiService.changeDetector = changeDetector;
    pushSubscription(
      'POSWiData',
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

  addToCart(product: any): void {
    const sku = JSON.parse(JSON.stringify(product.defaultSku));
    if (
      sku.discountRule &&
      sku.discountRule.discountType &&
      sku.discountRule.discount !== 0 &&
      sku.discountRule.ruleType === RuleType.Item
    ) {
      if (sku.discountRule.discountType === DiscountType.Percentage) {
        sku.dealPrice = sku.dealPrice * (sku.discountRule.discount / 100);
      } else if (sku.discountRule.discountType === DiscountType.FixedAdmount) {
        sku.dealPrice = sku.dealPrice - sku.discountRule.discount;
      }
    }
    if (!sku.dealPrice || sku.dealPrice.isNaN || sku.dealPrice <= 0) {
      sku.dealPrice = product.defaultSku.dealPrice;
    }
    if (this.cartList.find((item) => item.skuId === sku.id)) {
      const item = this.cartList.find((subitem) => subitem.skuId === sku.id);
      item.quantity = item.quantity ? item.quantity + 1 : 1;
    } else {
      this.cartList.push({
        tax: product.tax,
        skuId: sku.id,
        name: `${product.name} (${sku.name} ${sku.unit})`,
        mrp: sku.mrp,
        quantity: 1,
        payablePerUnit:
          !product.isTaxIncluded && product.tax && product.tax > 0
            ? sku.dealPrice + (sku.dealPrice * product.tax) / 100
            : sku.dealPrice,
        dealPrice: sku.dealPrice,
        primaryImage: sku.primaryImage,
        offer: sku.discountRule,
        itemDiscount: product.defaultSku.dealPrice - sku.dealPrice,
      });
    }
    this.getCartTotal();
  }

  removeFromCart(sku: CartProduct): void {
    this.cartList = this.cartList.filter((item) => item.skuId !== sku.skuId);
    this.getCartTotal();
  }

  getCartTotal(): void {
    this.cartTotal = 0;
    this.cartList.forEach((item) => {
      this.cartTotal += item.quantity * item.payablePerUnit;
    });
    this.applyCustomerDiscount();
  }

  payNow(): void {
    if (this.cartList && this.cartList.length) {
      this.modelRef = this.modalService.show(this.skuButtons, {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-right',
      });
    }
  }

  scanCode(): void {
    this.csPopup.show();
    pushSubscription(
      'Code',
      this.subList,
      this.csPopup.submit.subscribe((codes) => {
        if (codes && codes.length) {
          const dataUrl = this.wiService.getFieldValue(
            this.widgetConfig.widgetOptions,
            WidgetOptionType.PrimaryUrl
          );
          if (dataUrl) {
            // this.wiService.dataService
            //   .post<any>(Modules.Base + dataUrl, codes)
            //   .then((data) => {
            //     if (data.status === eExceptions.Success) {
            //       this.cartList = [];
            //     }
            //     this.wiService.detectChanges();
            //   });
          }
        }
      })
    );
  }

  onCustomer(): void {
    if (!this.formConfig) {
      this.request = {
        resourceName: this.wiService.getFieldValue(
          this.widgetConfig.widgetOptions,
          WidgetOptionType.PrimaryForm
        ),
      };
      const formUrl = this.wiService.getFieldValue(
        this.widgetConfig.widgetOptions,
        WidgetOptionType.SecondaryUrl
      );
      if (this.request.resourceName && formUrl) {
        this.wiService.dataService
          .postData<FormConfig>(Modules.Base + formUrl, this.request)
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
    this.custPopup.show({ formConfig: this.formConfig });
    pushSubscription(
      'CustomerForm',
      this.subList,
      this.custPopup.submit.subscribe((data) => {
        this.customer = data;
        this.applyCustomerDiscount();
        this.wiService.detectChanges();
      })
    );
  }

  applyCustomerDiscount(): void {
    let isApplied = false;
    this.cartDiscount = 0;
    if (
      this.customer &&
      this.customer.invMembership &&
      this.customer.invMembership.discounts
    ) {
      this.customer.invMembership.discounts.forEach((discount) => {
        const disc = discount.invDiscountRule;
        if (
          !isApplied &&
          disc &&
          disc.discount !== 0 &&
          disc.ruleType === RuleType.Invoice &&
          disc.minAmount <= this.cartTotal
        ) {
          if (
            !disc.maxAmount ||
            disc.maxAmount === 0 ||
            (disc.maxAmount !== 0 && disc.maxAmount >= this.cartTotal)
          ) {
            if (disc.discountType === DiscountType.Percentage) {
              this.cartDiscount = this.cartTotal * (disc.discount / 100);
            } else if (disc.discountType === DiscountType.FixedAdmount) {
              this.cartDiscount = this.cartTotal - disc.discount;
            }
            isApplied = true;
          }
        }
      });
    }
  }

  cleanPos(): void {
    this.customer = null;
    this.cartList = [];
    this.cartTotal = 0;
    this.cartDiscount = 0;
    this.modelRef.hide();
    this.wiService.detectChanges();
  }

  cardPayment(): void {
    this.inPopup.openModal(
      'Enter transaction number.',
      ComponentTypes.Text.toLowerCase()
    );
    pushSubscription(
      'Transaction',
      this.subList,
      this.inPopup.submit.subscribe((transaction) => {
        this.generateBill(transaction, 0);
      })
    );
  }

  cashPayment(): void {
    this.inPopup.openModal(
      'Enter cash provided',
      ComponentTypes.Number.toLowerCase()
    );

    pushSubscription(
      'Transaction',
      this.subList,
      this.inPopup.submit.subscribe((cash) => {
        const roundOff = Number(this.cartTotal - this.cartDiscount).toFixed(0);
        if (cash >= roundOff) {
          this.generateBill(0, cash);
        } else {
          this.wiService.dataService.notify(
            `Take minimum : ${Number(
              this.cartTotal - this.cartDiscount
            ).toFixed(0)}`,
            eMessageType.Error
          );
        }
      })
    );
  }

  scanAndPay(): void {}

  generateBill(cardTranId = 0, cashAdded = 0): void {
    const dataUrl = this.wiService.getFieldValue(
      this.widgetConfig.widgetOptions,
      WidgetOptionType.SaveUrl
    );
    if (dataUrl) {
      this.wiService.dataService
        .post<any>(Modules.Base + dataUrl, {
          pickUp: true,
          posOrder: true,
          skus: this.cartList,
          customer: this.customer,
          transactionId: cardTranId ? cardTranId : 0,
          inCash: cashAdded ? cashAdded : 0,
          billAmount: this.cartTotal,
          orderDiscount: this.cartTotal - this.cartDiscount,
        })
        .then((data) => {
          if (data.status === eExceptions.Success) {
            this.docPopup.show(data.data);
            this.cleanPos();
          }
        });
    }
  }

  ngOnDestroy(): void {
    destroySubscriptions(this.subList);
  }
}

export interface CartProduct {
  skuId: string;
  name: string;
  itemDiscount: number;
  dealPrice: number;
  mrp: number;
  quantity: number;
  tax: number;
  payablePerUnit: number;
  primaryImage?: string;
  offer?: any;
}

export enum DiscountType {
  Percentage = 1,
  FixedAdmount = 2,
}

export enum RuleType {
  Item = 1,
  Invoice = 2,
}
