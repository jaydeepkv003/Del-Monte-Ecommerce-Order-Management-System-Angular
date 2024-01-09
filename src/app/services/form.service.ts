import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ComponentTypes,
  eExceptions,
  Fields,
} from '@dynamics/dynamics.constants';
import { FieldOperations } from '@dynamics/dynamics.enum';
import {
  Behaviours,
  FieldConfig,
  FormConfig,
  KeyValuePair,
  PropertyOptions,
} from '@dynamics/dynamics.interface';
import { camelCase } from '@services/utiltiy.service';
import { Modules, Operations, Urls } from '@urls';
import { DataService } from './data.service';
import { DynamicsService } from './dynamics.service';

@Injectable()
export class FormService {
  private formConfigBackup: FormConfig;
  data: any;
  defaultData: any;
  dyForm: FormGroup;
  dyFormConfig: FormConfig;
  dyBehaviours: Behaviours[];
  dyPayload: any;
  dyInputLines = 2;
  savedData: any;

  constructor(
    public dataService: DataService,
    public dynamicsService: DynamicsService
  ) {}

  onLoadForm(formConfig: FormConfig, payload: any): void {
    this.defaultData = payload;
    this.dyFormConfig = JSON.parse(JSON.stringify(formConfig));
    this.formConfigBackup = JSON.parse(JSON.stringify(formConfig));
    this.dyBehaviours = this.dyFormConfig.behaviours;
    this.dyForm = this.dynamicsService.createFormControl(
      this.dyFormConfig.properties
    );
    const propertyCount = this.dyFormConfig.properties.length;
    this.dyInputLines =
      propertyCount < 10
        ? 2
        : propertyCount < 15
        ? 3
        : propertyCount < 20
        ? 4
        : 5;
    this.fillClientSideOptions(
      this.dyFormConfig.properties,
      this.dyFormConfig.behaviours
    );
    this.onFromChange(this.dyForm);
    this.onLoadData(payload);
  }

  onLoadData(payload: any): void {
    if (payload) {
      payload = this.getPropertyFirstCharUpperCase(payload);
      payload = this.patchSelectValue(payload);
      this.dyForm.patchValue(payload);
      this.dyPayload = payload;
    }
    this.runChangeDetaction(this.dyForm);
  }

  patchSelectValue(payload: any): void {
    this.dyFormConfig.properties
      .filter((field) => field.componentType === ComponentTypes.Select)
      .forEach((field) => {
        if (payload && payload[field.name]) {
          payload[field.name] = payload[field.name].toString();
        }
      });
    this.dyFormConfig.properties
      .filter((field) => field.componentType === ComponentTypes.MultiSelect)
      .forEach((field) => {
        if (payload && payload[field.name] && payload[field.name].length) {
          const varArray: string[] = [];
          payload[field.name].forEach((item: any) => {
            varArray.push(item.toString());
          });
          payload[field.name] = varArray;
        }
      });
    this.dyFormConfig.properties
      .filter((field) => field.componentType === ComponentTypes.Autocomplete)
      .forEach((field) => {
        if (payload && payload[field.name]) {
          payload[field.name] = payload[field.name].toString();
        }
      });
    return payload;
  }

  fillClientSideOptions(
    fields: FieldConfig[],
    dyBehaviours: Behaviours[]
  ): void {
    fields.forEach((field) => {
      const cascade = this.getMyCascade(dyBehaviours, field.name);
      if (!(cascade && cascade.length)) {
        if (
          field.componentType === ComponentTypes.Select ||
          field.componentType === ComponentTypes.Autocomplete ||
          field.componentType === ComponentTypes.MultiSelect ||
          field.componentType === ComponentTypes.Radio
        ) {
          if (field.propertyOptions && field.propertyOptions.url) {
            this.dataService
              .postData(Modules.Base + field.propertyOptions.url, null)
              .then((options) => {
                field.options = this.dynamicsService.fillOptionsFromData(
                  field.propertyOptions,
                  options
                );
              });
          } else if (
            (field.propertyOptions &&
              !field.propertyOptions.url &&
              !field.propertyOptions.isServerSide) ||
            (!field.options && field.propertyOptions)
          ) {
            this.dataService
              .postData<KeyValuePair[]>(
                Modules.OptionsUrl,
                field.propertyOptions
              )
              .then((options) => {
                field.options = options;
              });
          }
        }
      }
    });
  }

  onFromChange(dyForm: FormGroup): void {
    this.data = dyForm.value;
    dyForm.valueChanges.subscribe((formValue: KeyValuePair[]) => {
      this.onChangeSetCheckbox(this.dyFormConfig, dyForm);
      this.onChangesSetId(dyForm);
      const changedValues = this.dynamicsService.getDifference(
        this.data,
        formValue
      );
      const changedProperties: string[] = Object.keys(changedValues);
      changedProperties.forEach((property) => {
        this.data[property] = changedValues[property];
        const operations: Behaviours[] = this.getOperations(
          this.dyBehaviours,
          property
        );
        if (operations && operations.length) {
          operations.forEach((todo) => {
            switch (FieldOperations[todo.operation]) {
              case FieldOperations.Cascading: {
                const destinationFieldConfig = this.getFieldConfigByName(
                  this.dyFormConfig,
                  todo.destinationField
                );
                let data: PropertyOptions = {
                  ...destinationFieldConfig.propertyOptions,
                  cascadeBy: property,
                  cascadeValue: String(changedValues[property]),
                };
                if (data.cascadeAllData) {
                  data = { ...data, ...this.data };
                }
                if (data.url) {
                  this.dataService
                    .postData<KeyValuePair[]>(Urls.Base + data.url, data)
                    .then((options) => {
                      destinationFieldConfig.options = this.fillCascadeOptionsFromData(
                        data,
                        options
                      );
                    });
                } else {
                  this.dataService
                    .postData<KeyValuePair[]>(Modules.OptionsUrl, data)
                    .then((options) => {
                      destinationFieldConfig.options = options;
                    });
                }
                break;
              }
              case FieldOperations.Disable: {
                (todo.compareEqual &&
                  String(changedValues[property]) === todo.sourceValue) ||
                (!todo.compareEqual &&
                  String(changedValues[property]) !== todo.sourceValue)
                  ? dyForm.get(todo.destinationField).disable()
                  : dyForm.get(todo.destinationField).enable();
                break;
              }
              case FieldOperations.SetValue: {
                if (
                  (todo.compareEqual &&
                    String(changedValues[property]) === todo.sourceValue) ||
                  (!todo.compareEqual &&
                    String(changedValues[property]) !== todo.sourceValue)
                ) {
                  dyForm
                    .get(todo.destinationField)
                    .setValue(todo.destinationeValue);
                }
                break;
              }
              case FieldOperations.ResetValidation: {
                dyForm.get(property).markAsUntouched();
                if (
                  (todo.compareEqual &&
                    String(changedValues[property]) === todo.sourceValue) ||
                  (!todo.compareEqual &&
                    String(changedValues[property]) !== todo.sourceValue)
                ) {
                  this.onRemoveValidation(dyForm, todo.destinationField);
                } else {
                  this.onBindValidations(dyForm, todo.destinationField);
                }
                break;
              }
              case FieldOperations.Hide: {
                this.getFieldConfigByName(
                  this.dyFormConfig,
                  todo.destinationField
                ).isHidden =
                  (todo.compareEqual &&
                    String(changedValues[property]) === todo.sourceValue) ||
                  (!todo.compareEqual &&
                    String(changedValues[property]) !== todo.sourceValue)
                    ? true
                    : false;
                break;
              }
              default: {
                break;
              }
            }
          });
        }
      });
    });
  }

  runChangeDetaction(dyForm: FormGroup): void {
    const operations: Behaviours[] = this.dyBehaviours;
    if (operations && operations.length) {
      operations.forEach((todo) => {
        switch (FieldOperations[todo.operation]) {
          case FieldOperations.Disable: {
            (todo.compareEqual &&
              String(dyForm.value[todo.sourceField]) === todo.sourceValue) ||
            (!todo.compareEqual &&
              String(dyForm.value[todo.sourceField]) !== todo.sourceValue)
              ? dyForm.get(todo.destinationField).disable()
              : dyForm.get(todo.destinationField).enable();
            break;
          }
          case FieldOperations.SetValue: {
            if (
              (todo.compareEqual &&
                String(dyForm.value[todo.sourceField]) === todo.sourceValue) ||
              (!todo.compareEqual &&
                String(dyForm.value[todo.sourceField]) !== todo.sourceValue)
            ) {
              dyForm
                .get(todo.destinationField)
                .setValue(todo.destinationeValue);
            }
            break;
          }
          case FieldOperations.Hide: {
            this.getFieldConfigByName(
              this.dyFormConfig,
              todo.destinationField
            ).isHidden =
              (todo.compareEqual &&
                String(dyForm.value[todo.sourceField]) === todo.sourceValue) ||
              (!todo.compareEqual &&
                String(dyForm.value[todo.sourceField]) !== todo.sourceValue)
                ? true
                : false;
            break;
          }
          default: {
            break;
          }
        }
      });
    }
  }

  onChangeSetCheckbox(dyFormConfig: FormConfig, dyForm: FormGroup): void {
    dyFormConfig.properties
      .filter(
        (field) =>
          field.componentType === ComponentTypes.Checkbox ||
          field.componentType === ComponentTypes.Switch
      )
      .forEach((field) => {
        if (dyForm.get(field.name).value === null) {
          dyForm.get(field.name).setValue(field.checked);
        }
      });
  }

  onChangesSetId(dyForm: FormGroup): void {
    if (dyForm.value[Fields.Id] === null) {
      dyForm
        .get(Fields.Id)
        .setValue(
          this.dyPayload && this.dyPayload[Fields.Id] !== 0
            ? this.dyPayload[Fields.Id]
            : 0
        );
    }
  }

  onRemoveValidation(dyForm: FormGroup, property: string): void {
    this.dyFormConfig.properties.find(
      (p) => p.name === property
    ).validations = [];
    dyForm.get(property).clearValidators();
    dyForm.updateValueAndValidity();
    this.onRebuildProperty(property);
  }

  onBindValidations(dyForm: FormGroup, property: string): void {
    const fieldConfigBackup = this.getFieldConfigByName(
      this.formConfigBackup,
      property
    );
    if (fieldConfigBackup && fieldConfigBackup.validations) {
      this.dyFormConfig.properties.find(
        (p) => p.name === property
      ).validations = fieldConfigBackup.validations;
      dyForm
        .get(property)
        .setValidators(
          this.dynamicsService.bindValidations(
            this.dynamicsService.bindPropertyAttributes(fieldConfigBackup)
              .validations
          )
        );
      dyForm.updateValueAndValidity();
      this.onRebuildProperty(property);
    }
  }

  onRebuildProperty(property: string): void {
    this.dyFormConfig.properties.find(
      (p) => p.name === property
    ).rebuildControl = true;
    setTimeout(() => {
      this.dyFormConfig.properties.find(
        (p) => p.name === property
      ).rebuildControl = false;
    }, 0);
  }

  async onSubmit(event: Event, isOperation: boolean = true): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (this.isValidForm(event)) {
        if (this.dyFormConfig.submitUrl) {
          let submitUrl = `${Urls.Base}${this.dyFormConfig.submitUrl}`;
          if (isOperation) {
            submitUrl = submitUrl + Operations.Save;
          }
          if (
            this.dyFormConfig.properties.filter(
              (field) =>
                field.componentType === ComponentTypes.Image ||
                field.componentType === ComponentTypes.Excel ||
                field.componentType === ComponentTypes.File
            ).length > 0
          ) {
            this.dataService
              .postFile<any>(submitUrl, this.dyForm.value)
              .then((data) => {
                if (data && data.data) {
                  this.savedData = data.data;
                }
                resolve(data.status === eExceptions.Success ? true : false);
              });
          } else {
            this.dataService
              .post<any>(submitUrl, this.dyForm.value)
              .then((data) => {
                if (data && data.data) {
                  this.savedData = data.data;
                }
                resolve(data.status === eExceptions.Success ? true : false);
              });
          }
        } else {
          resolve(true);
        }
      }
    });
  }

  async onSearch(event: Event): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (this.isValidForm(event)) {
        resolve(true);
      }
    });
  }

  async onExport(event: Event): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (this.dyFormConfig.submitUrl) {
        if (this.isValidForm(event)) {
          this.dataService.downloadFile(
            `${Urls.Base}${this.dyFormConfig.submitUrl}${Operations.Export}`,
            this.dyForm.value
          );
          resolve(true);
        }
      } else {
        resolve(true);
      }
    });
  }

  isValidForm(event: Event): boolean {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    return this.validateForm();
  }

  validateForm(): boolean {
    if (!this.dyForm.valid) {
      this.dynamicsService.validateAllFormFields(this.dyForm);
      return false;
    } else {
      return true;
    }
  }

  getFieldConfigByName(
    dyFormConfig: FormConfig,
    propertyName: string
  ): FieldConfig {
    return dyFormConfig.properties.find((p) => p.name === propertyName);
  }

  getFieldNameById(dyFormConfig: FormConfig, propertyId: string): string {
    return dyFormConfig.properties.find((p) => p.id === propertyId).name;
  }

  getOperations(dyBehaviours: Behaviours[], property: string): Behaviours[] {
    return dyBehaviours && dyBehaviours.length
      ? dyBehaviours.filter((f) => f.sourceField === property)
      : null;
  }

  getMyCascade(dyBehaviours: Behaviours[], property: string): Behaviours[] {
    return dyBehaviours && dyBehaviours.length
      ? dyBehaviours.filter((f) => f.destinationField === property)
      : null;
  }

  getPropertyFirstCharUpperCase(data: KeyValuePair[]): any {
    const keyValues = Object.keys(data).map((key) => {
      const newKey = key[0].toUpperCase() + key.slice(1);
      return { [newKey]: data[key] };
    });
    return Object.assign({}, ...keyValues);
  }

  getDataFirstCharTitleCase(data: any): any {
    if (data instanceof Array) {
      return data.forEach((element) => {
        this.getDataFirstCharTitleCase(element);
      });
    } else if (data !== null && data.constructor === Object) {
      return Object.keys(data).map((key) => {
        const newKey = key[0].toUpperCase() + key.slice(1);
        return { [newKey]: data[key] };
      });
    }
  }

  fillCascadeOptionsFromData(
    propertyOptions: PropertyOptions,
    data
  ): KeyValuePair[] {
    const options: KeyValuePair[] = [];
    if (data != null && data.length > 0) {
      data.forEach((element) => {
        if (propertyOptions.cascadeAllData) {
          options.push({
            key: element[camelCase(propertyOptions.keyField)].toString(),
            value: element[camelCase(propertyOptions.valueField)],
          });
        } else if (
          element[camelCase(propertyOptions.cascadeBy)].toString() ===
          propertyOptions.cascadeValue
        ) {
          options.push({
            key: element[camelCase(propertyOptions.keyField)].toString(),
            value: element[camelCase(propertyOptions.valueField)],
          });
        }
      });
    }
    return options;
  }
}
