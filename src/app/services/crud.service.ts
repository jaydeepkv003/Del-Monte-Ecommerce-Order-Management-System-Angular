import { ChangeDetectorRef, Injectable, OnDestroy } from '@angular/core';
import { eExceptions } from '@dynamics/dynamics.constants';
import {
  FormConfig,
  FormInput,
  ResourceRequest,
  TableConfig,
} from '@dynamics/dynamics.interface';
import { DyFormPopupComponent } from '@dynamics/forms/dy-form-popup/dy-form-popup.component';
import { Operations, Urls } from '@urls';
import { DataService } from './data.service';
import { ResourcesService } from './resources.service';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from './subscriber.service';

@Injectable()
export class CrudService implements OnDestroy {
  private subList: SubscriptionObject[] = [];
  public changeDetector: ChangeDetectorRef;
  public formPopup: DyFormPopupComponent;

  filterValue = '';

  filterDataConfig = {};
  isReport = false;
  isExtCrud = false;
  isExtEdit = false;
  isDocument = false;
  reloadData = false;
  enableTable = false;
  enableCreate = false;

  formConfig: FormConfig;
  tableConfig: TableConfig;

  formInput: FormInput;
  printData: any;
  documentData: {};

  constructor(
    public dataService: DataService,
    public resourcesService: ResourcesService
  ) {
    pushSubscription(
      'ResourceSub',
      this.subList,
      this.resourcesService.resourceSubject.subscribe(() => {
        this.onPublishForm();
        this.onPublishTable();
      })
    );
  }

  onPublishForm(
    resourceRequest: ResourceRequest = this.resourcesService.resourceRequest
  ): void {
    this.formConfig = null;
    this.dataService
      .postData<FormConfig>(Urls.Forms.GetForm, resourceRequest)
      .then((response) => {
        this.formConfig = new FormConfig();
        this.formConfig = response;
        this.enableCreate =
          this.formConfig &&
          this.resourcesService.accessDetails &&
          this.resourcesService.accessDetails.isCreate
            ? true
            : false;
        this.detectChanges();
      });
  }

  onPublishTable(
    resourceRequest: ResourceRequest = this.resourcesService.resourceRequest
  ): void {
    this.tableConfig = null;
    this.dataService
      .postData<TableConfig>(Urls.Tables.GetTable, resourceRequest)
      .then((table) => {
        this.tableConfig = new TableConfig();
        this.tableConfig = table;
        this.enableTable =
          this.tableConfig &&
          this.resourcesService.accessDetails &&
          this.resourcesService.accessDetails.isView
            ? true
            : false;
        this.detectChanges();
      });
  }

  onOpenForm(data: any = {}): void {
    this.isDocument = false;
    if (this.formConfig && this.formConfig.properties) {
      this.formInput = { formConfig: this.formConfig, formData: data };
      this.reloadData = false;
      if (this.isExtCrud && !this.isReport) {
        this.isExtEdit = true;
      } else {
        this.formPopup.show(this.formInput);
        pushSubscription(
          'CrudFormSub',
          this.subList,
          this.formPopup.submit.subscribe((returnData) => {
            if (this.isReport) {
              this.filterDataConfig = returnData;
            } else {
              this.reloadData = true;
            }
            this.detectChanges();
          })
        );
      }
    }
    setTimeout(() => this.detectChanges(), 750);
  }

  onOpenDocument(data: any): void {
    if (this.formConfig.submitUrl) {
      this.documentData = data;
      this.dataService
        .post<any>(
          `${Urls.Base}${this.formConfig.submitUrl}${Operations.Document}`,
          { Data: data.id }
        )
        .then((resp) => {
          if (resp.status === eExceptions.Success) {
            this.printData = resp.data;
            this.isDocument = true;
            this.detectChanges();
          }
        });
    }
  }

  onCloseForm(): void {
    this.reloadData = true;
    this.isExtEdit = false;
    this.isDocument = false;
    this.detectChanges();
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
