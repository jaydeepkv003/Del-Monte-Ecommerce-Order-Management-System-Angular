import { Component } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '@dynamics/dynamics.interface';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-switch',
  templateUrl: './dy-switch.component.html',
  styleUrls: ['./dy-switch.component.scss'],
})
export class DySwitchComponent {
  field: FieldConfig;
  group: FormGroup;
  form: FormGroupDirective;
  constructor() {}
}
