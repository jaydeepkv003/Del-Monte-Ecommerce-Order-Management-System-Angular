import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { WidgetOptionType } from '@dynamics/dynamics.enum';
import {
  FormConfig,
  ResourceRequest,
  WidgetConfig,
} from '@dynamics/dynamics.interface';
import { DyFormPopupComponent } from '@dynamics/forms/dy-form-popup/dy-form-popup.component';
import { WidgetDynamicService } from '@services/widget.dynamic.service';
import { Modules } from '@urls';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-wi-button',
  templateUrl: './dy-wi-button.component.html',
  styleUrls: ['./dy-wi-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WidgetDynamicService],
})
export class DyWiButtonComponent {
  @ViewChild('formPopup', { static: true }) formPopup: DyFormPopupComponent;
  widgetConfig: WidgetConfig;
  request: ResourceRequest;
  formConfig: FormConfig;

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
  }

  onAction(): void {
    if (!this.formConfig) {
      this.request = {
        resourceName: this.wiService.getFieldValue(
          this.widgetConfig.widgetOptions,
          WidgetOptionType.PrimaryForm
        ),
      };
      if (this.request.resourceName) {
        this.wiService.dataService
          .postData<FormConfig>(
            Modules.Base + this.widgetConfig.dataUrl,
            this.request
          )
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
    this.formPopup.show({ formConfig: this.formConfig });
  }
}
