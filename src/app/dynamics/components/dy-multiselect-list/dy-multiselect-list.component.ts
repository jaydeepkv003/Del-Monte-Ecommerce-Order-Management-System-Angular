import { Component, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '@dynamics/dynamics.interface';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-multiselect-list',
  templateUrl: './dy-multiselect-list.component.html',
  styleUrls: ['./dy-multiselect-list.component.scss'],
})
export class DyMultiselectListComponent {
  field: FieldConfig;
  group: FormGroup;
  form: FormGroupDirective;
  constructor() {}
}
