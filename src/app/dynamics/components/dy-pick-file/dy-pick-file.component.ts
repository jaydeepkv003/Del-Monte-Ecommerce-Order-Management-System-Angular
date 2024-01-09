import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {
  ComponentTypes,
  Fields,
  FileTypes,
} from '@dynamics/dynamics.constants';
import { FieldConfig } from '@dynamics/dynamics.interface';
import { Modules } from '@urls';
import {
  DropzoneComponent,
  DropzoneConfigInterface,
} from 'ngx-dropzone-wrapper';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-pick-file',
  templateUrl: './dy-pick-file.component.html',
  styleUrls: ['./dy-pick-file.component.scss'],
})
export class DyPickFileComponent {
  @ViewChild('dropzones') dropzone: DropzoneComponent;

  config: DropzoneConfigInterface = {
    url: 'https://kautilyam.com/',
    thumbnailWidth: 160,
    autoProcessQueue: false,
  };
  constructor(public sanitizer: DomSanitizer) {}

  existingFiles = [];
  uploadFileList: File[] = [];
  singleFileName = 'uploaded';

  isMultiple = false;
  isPreview = false;
  imageUrl = `${Modules.Images}${localStorage.TenantCode}/`;

  fieldConfig: FieldConfig;
  group: FormGroup;
  form: FormGroupDirective;

  @Input()
  set field(data: FieldConfig) {
    this.fieldConfig = data;
    this.isMultiple = data.checked;
    this.bindUploader(data);
    this.onAddExistingFile();
    this.bindResetEvent();
  }

  bindUploader(data: FieldConfig): void {
    switch (data.componentType) {
      case ComponentTypes.Excel: {
        this.config = {
          ...this.config,
          acceptedFiles: FileTypes.Excel,
          uploadMultiple: this.isMultiple,
        };
        break;
      }
      case ComponentTypes.Image: {
        this.isPreview = true;
        this.config = {
          ...this.config,
          acceptedFiles: FileTypes.Image,
          uploadMultiple: this.isMultiple,
        };
        break;
      }
      default: {
        break;
      }
    }
  }

  onAddedFile(file: File): void {
    if (!this.isMultiple) {
      this.uploadFileList = [file];
      this.existingFiles = [];
      if (!this.group.controls[this.fieldConfig.name].value) {
        this.group.controls[this.fieldConfig.name].setValue(
          this.singleFileName
        );
      }
    } else {
      this.uploadFileList.push(file);
      this.prepareMultipleList();
    }
    this.group.controls[Fields.MyFiles].setValue(this.uploadFileList);
    this.dropzone.directiveRef.reset();
  }

  bindResetEvent(): void {
    setTimeout(() => {
      if (!this.existingFiles) {
        this.existingFiles = this.group.value[this.fieldConfig.name];
      }
      this.group.controls[this.fieldConfig.name].valueChanges.subscribe(
        (value) => {
          if (!value) {
            this.uploadFileList = [];
            this.dropzone.directiveRef.reset();
          }
        }
      );
    }, 500);
  }

  onAddExistingFile(): void {
    setTimeout(() => {
      const imageList = this.group.get(this.fieldConfig.name).value;
      if (
        this.group &&
        this.fieldConfig &&
        this.fieldConfig.name &&
        imageList
      ) {
        if (imageList instanceof Array) {
          imageList.forEach((image) => {
            this.existingFiles.push(image);
          });
        } else {
          this.existingFiles.push(imageList);
        }
      }
    }, 500);
  }

  onRemoveExistingFile(name: string): void {
    if (this.isMultiple) {
      this.existingFiles = this.existingFiles.filter((f) => f !== name);
      this.prepareMultipleList();
    } else {
      this.existingFiles = [];
      this.singleFileName = this.group.controls[this.fieldConfig.name].value;
      this.group.controls[this.fieldConfig.name].setValue(null);
    }
  }

  onRemoveNewFile(index: number): void {
    if (this.isMultiple) {
      this.existingFiles = this.uploadFileList.splice(index, 1);
      this.prepareMultipleList();
    } else {
      this.existingFiles = [];
      this.group.controls[this.fieldConfig.name].setValue(null);
    }
  }

  imageBrowserUrl(file: File): string {
    return window.URL
      ? window.URL.createObjectURL(file)
      : (window as any).webkitURL.createObjectURL(file);
  }

  prepareMultipleList(): void {
    const list = [];
    this.existingFiles.forEach((newFile) => {
      list.push(newFile);
    });
    this.uploadFileList.forEach((newFile) => {
      list.push(newFile.name);
    });
    this.group.controls[this.fieldConfig.name].setValue(list);
  }
}
