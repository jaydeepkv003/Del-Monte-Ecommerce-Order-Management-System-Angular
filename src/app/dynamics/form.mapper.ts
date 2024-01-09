import { DyButtonComponent } from './components/dy-button/dy-button.component';
import { DyCheckboxComponent } from './components/dy-checkbox/dy-checkbox.component';
import { DyIconSelectComponent } from './components/dy-icon-select/dy-icon-select.component';
import { DyInputComponent } from './components/dy-input/dy-input.component';
import { DyMultiselectListComponent } from './components/dy-multiselect-list/dy-multiselect-list.component';
import { DyMultiselectComponent } from './components/dy-multiselect/dy-multiselect.component';
import { DyPickDateComponent } from './components/dy-pick-date/dy-pick-date.component';
import { DyPickFileComponent } from './components/dy-pick-file/dy-pick-file.component';
import { DySelectComponent } from './components/dy-select/dy-select.component';
import { DySwitchComponent } from './components/dy-switch/dy-switch.component';
import { DyTextareaComponent } from './components/dy-textarea/dy-textarea.component';

export const ComponentMapper = {
  Text: DyInputComponent,
  Password: DyInputComponent,
  Number: DyInputComponent,
  Email: DyInputComponent,
  Textarea: DyTextareaComponent,

  Checkbox: DyCheckboxComponent,
  Switch: DySwitchComponent,

  Select: DySelectComponent,
  MultiSelect: DyMultiselectComponent,
  MultiSelectList: DyMultiselectListComponent,
  IconSelect: DyIconSelectComponent,
  Autocomplete: DySelectComponent,

  Date: DyPickDateComponent,

  Submit: DyButtonComponent,
  Reset: DyButtonComponent,

  Image: DyPickFileComponent,
  File: DyPickFileComponent,
  Excel: DyPickFileComponent,

  // Radio: DyRadioComponent,
  // Time: DyInputComponent,
  // Link: DyInputComponent,
  // Pdf: DyPickFileComponent,
};
