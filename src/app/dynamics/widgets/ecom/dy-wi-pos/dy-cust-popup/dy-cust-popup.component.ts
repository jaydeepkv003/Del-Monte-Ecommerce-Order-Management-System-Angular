import {
  Component,
  EventEmitter,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FieldConfig, FormInput } from '@dynamics/dynamics.interface';
import { FormService } from '@services/form.service';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from '@services/subscriber.service';
import { Urls } from '@urls';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-cust-popup',
  templateUrl: './dy-cust-popup.component.html',
  styleUrls: ['./dy-cust-popup.component.scss'],
  providers: [BsModalService, FormService],
})
export class DyCustPopupComponent implements OnDestroy {
  modalRef: BsModalRef;
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  submit: EventEmitter<any> = new EventEmitter<any>();
  private subList: SubscriptionObject[] = [];
  private lastLoadedContact;

  constructor(
    private modalService: BsModalService,
    public formService: FormService
  ) {}

  show(formInput?: FormInput): void {
    if (formInput) {
      this.formService.onLoadForm(formInput.formConfig, formInput.formData);
    }
    this.modalRef = this.modalService.show(this.template, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-right',
    });
    this.lastLoadedContact = null;
    const fieldConfig: FieldConfig = formInput.formConfig.properties.find(
      (d) => d.name === 'Contact'
    );
    if (
      fieldConfig &&
      fieldConfig.propertyOptions &&
      fieldConfig.propertyOptions.url
    ) {
      pushSubscription(
        'Code',
        this.subList,
        this.formService.dyForm.controls.Contact.valueChanges.subscribe(
          (value) => {
            if (
              value &&
              value.length === 10 &&
              this.lastLoadedContact !== value
            ) {
              this.lastLoadedContact = value;
              this.formService.dataService
                .postData<any[]>(Urls.Base + fieldConfig.propertyOptions.url, {
                  data: value,
                })
                .then((response) => {
                  if (response && response.length) {
                    this.formService.onLoadData({ ...response[0] });
                  } else {
                    this.formService.dyForm.reset();
                    this.formService.dyForm.patchValue({
                      Contact: value,
                      Id: 0,
                    });
                  }
                });
            }
          }
        )
      );
    }
  }

  async onSubmit(event: Event): Promise<void> {
    if (this.formService.dyFormConfig.isSave) {
      if (await this.formService.onSubmit(event, false)) {
        this.submit.next(this.formService.savedData);
        this.modalRef.hide();
      }
    }
  }

  onReset(): void {
    this.formService.onLoadForm(
      this.formService.dyFormConfig,
      this.formService.defaultData
    );
  }

  ngOnDestroy(): void {
    destroySubscriptions(this.subList);
  }
}
