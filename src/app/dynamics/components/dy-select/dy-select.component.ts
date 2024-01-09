import { Component } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '@dynamics/dynamics.interface';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-select',
  templateUrl: './dy-select.component.html',
  styleUrls: ['./dy-select.component.scss'],
})
export class DySelectComponent {
  field: FieldConfig;
  group: FormGroup;
  form: FormGroupDirective;
  constructor() {}
}
