import { Component } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '@dynamics/dynamics.interface';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-icon-select',
  templateUrl: './dy-icon-select.component.html',
  styleUrls: ['./dy-icon-select.component.scss'],
})
export class DyIconSelectComponent {
  field: FieldConfig;
  group: FormGroup;
  form: FormGroupDirective;
  constructor() {}
}
