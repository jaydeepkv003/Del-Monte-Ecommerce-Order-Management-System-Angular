import { Injectable } from '@angular/core';
import { FormConfig, ResourceRequest } from '@dynamics/dynamics.interface';
import { DyFormPopupComponent } from '@dynamics/forms/dy-form-popup/dy-form-popup.component';
import { Urls } from '@urls';
import { DataService } from './data.service';

@Injectable()
export class PopupService {
  public formPopup: DyFormPopupComponent;

  constructor(public dataService: DataService) {}

  onOpenPopup(resourceRequest: ResourceRequest, data?: any): void {
    this.dataService
      .postData<FormConfig>(Urls.Forms.GetForm, resourceRequest)
      .then((response) => {
        if (response) {
          this.formPopup.show({ formConfig: response, formData: data });
        }
      });
  }
}
