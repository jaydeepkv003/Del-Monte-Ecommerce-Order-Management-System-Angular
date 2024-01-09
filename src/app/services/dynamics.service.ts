import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ComponentTypes, Fields } from '@dynamics/dynamics.constants';
import { eValidators } from '@dynamics/dynamics.enum';
import {
  FieldConfig,
  KeyValuePair,
  PropertyOptions,
  Validator,
} from '@dynamics/dynamics.interface';
import { camelCase } from '@services/utiltiy.service';

@Injectable()
export class DynamicsService {
  constructor(private formBuilder: FormBuilder) {}

  createFormControl(fields: FieldConfig[]): FormGroup {
    const group: FormGroup = this.formBuilder.group({});
    group.addControl(Fields.Id, this.formBuilder.control(0));
    group.addControl(Fields.MyFiles, new FormControl(''));
    fields.forEach((field) => {
      if (
        field.componentType === ComponentTypes.Submit ||
        field.componentType === ComponentTypes.Reset
      ) {
        return;
      }
      if (
        field.componentType === ComponentTypes.Checkbox ||
        field.componentType === ComponentTypes.Switch
      ) {
        field.value = field.checked ? field.checked : false;
      }
      field = this.bindPropertyAttributes(field);
      group.addControl(
        field.name,
        this.formBuilder.control(
          field.value,
          this.bindValidations(field.validations || [])
        )
      );
    });
    return group;
  }

  bindValidations(validations: Validator[]): any {
    if (validations && validations.length > 0) {
      const validList = [];
      validations.forEach((valid) => {
        validList.push(valid.validator);
      });
      return Validators.compose(validList);
    }
    return [];
  }

  bindPropertyAttributes(fieldConfig: FieldConfig): FieldConfig {
    if (fieldConfig.validations && fieldConfig.validations.length > 0) {
      fieldConfig.validations.forEach((valid) => {
        switch (eValidators[valid.validationType]) {
          case eValidators.Required: {
            valid.validator = Validators.required;
            valid.name = 'required';
            break;
          }
          case eValidators.Pattern: {
            valid.validator = Validators.pattern;
            valid.name = 'pattern';
            break;
          }
          case eValidators.Email: {
            valid.validator = Validators.email;
            valid.name = 'email';
            break;
          }
          case eValidators.MinLength: {
            fieldConfig.minLength = +valid.validationValue;
            valid.validator = Validators.minLength(+valid.validationValue);
            valid.name = 'minlength';
            break;
          }
          case eValidators.MaxLength: {
            fieldConfig.maxLength = +valid.validationValue;
            valid.validator = Validators.maxLength(+valid.validationValue);
            valid.name = 'maxlength';
            break;
          }
          case eValidators.Min: {
            fieldConfig.min = +valid.validationValue;
            valid.validator = Validators.min(+valid.validationValue);
            valid.name = 'min';
            break;
          }
          case eValidators.Max: {
            fieldConfig.max = +valid.validationValue;
            valid.validator = Validators.max(+valid.validationValue);
            valid.name = 'max';
            break;
          }
        }
      });
    }
    return fieldConfig;
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  getDifference(oldValue, newValue): any {
    return Object.keys(newValue).reduce((changes, key) => {
      const value = newValue[key];
      const formattedValue = typeof value === 'string' ? value.trim() : value;
      return formattedValue === oldValue[key]
        ? changes
        : { ...changes, [key]: newValue[key] };
    }, {});
  }

  fillOptionsFromData(propertyOptions: PropertyOptions, data): KeyValuePair[] {
    const options: KeyValuePair[] = [];
    if (data != null && data.length > 0) {
      data.forEach((element) => {
        options.push({
          key: element[camelCase(propertyOptions.keyField)].toString(),
          value: element[camelCase(propertyOptions.valueField)],
        });
      });
    }
    return options;
  }
}
