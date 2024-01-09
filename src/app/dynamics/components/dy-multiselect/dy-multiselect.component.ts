import { Component } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '@dynamics/dynamics.interface';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-multiselect',
  templateUrl: './dy-multiselect.component.html',
  styleUrls: ['./dy-multiselect.component.scss'],
})
export class DyMultiselectComponent {
  field: FieldConfig;
  group: FormGroup;
  form: FormGroupDirective;
  constructor() {}
}
