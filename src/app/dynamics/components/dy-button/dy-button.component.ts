import { Component, Input } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '@dynamics/dynamics.interface';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-button',
  templateUrl: './dy-button.component.html',
  styleUrls: ['./dy-button.component.scss'],
})
export class DyButtonComponent {
  // @Input() currentState = ''; // show-spinner | show-success | show-fail
  // @Input() message = '';
  // @Input() showMessage = false;
  // @Input() isDisabled = false;
  // @Input() btnClass = 'btn';

  field: FieldConfig;
  group: FormGroup;
  ngForm: FormGroupDirective;

  @Input()
  set form(pfrom: FormGroupDirective) {
    this.ngForm = pfrom;
  }

  btnClass = 'btn';
  currentState = '';
  constructor() {}
}
