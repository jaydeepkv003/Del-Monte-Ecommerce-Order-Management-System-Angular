import { AfterViewInit, Component } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '@dynamics/dynamics.interface';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-pick-date',
  templateUrl: './dy-pick-date.component.html',
  styleUrls: ['./dy-pick-date.component.scss'],
})
export class DyPickDateComponent implements AfterViewInit {
  field: FieldConfig;
  group: FormGroup;
  form: FormGroupDirective;
  existingValue: any;

  constructor(private localeService: BsLocaleService) {}

  ngAfterViewInit(): void {
    this.existingValue = this.group.controls[this.field.name].value;
  }

  dateChange(data: any): void {
    if (data instanceof Date) {
      this.group.controls[this.field.name].setValue(
        new Date(data.getTime() - data.getTimezoneOffset() * 60 * 1000)
      );
    } else {
      this.group.controls[this.field.name].setValue(data);
    }
  }
}
