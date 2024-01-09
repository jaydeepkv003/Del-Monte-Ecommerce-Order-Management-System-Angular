import { Title } from '@angular/platform-browser';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { DataType } from '@dynamics/dynamics.enum';
import {
  IMenuItem,
  KeyValuePair,
  TableColumn,
  TableConfig,
  TableData,
} from '@dynamics/dynamics.interface';
import { camelCase } from '@services/utiltiy.service';
import { Modules, Operations, Urls } from '@urls';
import { DataService } from './data.service';
import { DynamicsService } from './dynamics.service';

@Injectable()
export class TableService {
  public originalData: TableData[] = [];
  public changeDetector: ChangeDetectorRef;
  imageColumn = null;
  titleColumn = null;

  tableConfig: TableConfig;

  hiddenColumnsForExoprt: number[] = [];
  itemsPerPage = 10;
  itemOptionsPerPage: number[] = [5, 10, 25, 100, 500, 1000];

  dyColumns: TableColumn[];
  dyCardColumns: TableColumn[];
  dyActions: boolean;
  DataTypes: any = DataType;
  accessDetails: IMenuItem;
  localfilterValue = '';
  cardview = true;

  viewData: any;

  serverFilterValue = null;

  constructor(
    public dataService: DataService,
    public dynamicsService: DynamicsService
  ) {}

  processDataForView(data: any): void {
    this.originalData = JSON.parse(JSON.stringify(data));
    this.dyColumns.forEach((column) => {
      if (column.options && column.options.length) {
        data.forEach((row) => {
          if (row[column.name]) {
            if (row[column.name] instanceof Array) {
              const varArray: string[] = [];
              row[column.name].forEach((item: any) => {
                const option = column.options.find(
                  (c) => c.key === item.toString()
                );
                if (option && option.value) {
                  varArray.push(option.value);
                }
              });
              row[column.name] = varArray.length ? varArray.join(', ') : '';
            } else {
              const option = column.options.find(
                (c) => c.key === row[column.name].toString()
              );
              row[column.name] = option ? option.value : '';
            }
            this.fillDefaultImage(row);
            this.fillDefaultTitle(row);
          }
        });
      }
    });
  }

  onLoadTable(tableConfig: TableConfig): void {
    if (tableConfig && tableConfig.columns && tableConfig.columns.length > 0) {
      this.dyColumns = [];
      this.tableConfig = this.processOptions(tableConfig);
      this.tableConfig.columns.forEach(async (column) => {
        if (!(tableConfig.isSubTable && column.notInSubTable)) {
          this.dyColumns.push({ ...column, name: camelCase(column.name) });
        }
      });
      this.dyActions = tableConfig.isActions;
      if (tableConfig.isPreDefined && !tableConfig.isSubTable) {
        this.onSelect(tableConfig.dataUrl);
      }
      this.dyCardColumns = this.dyColumns.filter(
        (d) => d.dataType !== this.DataTypes.Image
      );
      this.imageColumn = this.dyColumns.find(
        (d) => d.dataType === this.DataTypes.Image
      );
      this.itemsPerPage = tableConfig.rowPerPage;
      this.detectChanges();
    }
  }

  processOptions(tableConfig: TableConfig): TableConfig {
    if (tableConfig && tableConfig.columns && tableConfig.columns.length > 0) {
      tableConfig.columns.forEach(async (column) => {
        if (column.columnOptions && column.columnOptions.url) {
          await this.getFromUrlAsOptions(column.columnOptions).then(
            (options) => {
              column.options = options;
              this.dyColumns.find(
                (tabCol) => tabCol.name === camelCase(column.name)
              ).options = options;
            }
          );
        }
      });
    }
    return tableConfig;
  }

  getFromUrlAsOptions(options: any): Promise<KeyValuePair[]> {
    return new Promise<KeyValuePair[]>((resolve) => {
      this.dataService
        .postData(Modules.Base + options.url, null)
        .then((data) => {
          resolve(this.dynamicsService.fillOptionsFromData(options, data));
        });
    });
  }

  async onSelect(url: any, isOperation: boolean = true): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (url) {
        let selectUrl = `${Urls.Base}${url}`;
        if (isOperation) {
          selectUrl = selectUrl + Operations.Select;
        }
        this.dataService
          .postData<any>(selectUrl, this.serverFilterValue)
          .then((data) => {
            this.fillData(data);
            this.detectChanges();
            resolve(true);
          });
      } else {
        resolve(true);
      }
    });
  }

  fillData(data: any): void {
    if (data && data.length) {
      this.processDataForView(data);
      this.viewData = data;
    } else {
      this.viewData = [];
    }
  }

  fillDefaultImage(data: any): string {
    data.defaultImage = '';
    if (data && this.imageColumn) {
      const imageData = data[this.imageColumn.name];
      data.defaultImage =
        imageData && this.isImageArray(imageData) && imageData.length
          ? imageData[0].toString()
          : imageData;
    }
    return data.defaultImage;
  }

  fillDefaultTitle(data: any): string {
    data.defaultTitle = '';
    if (!this.titleColumn && this.dyCardColumns && this.dyCardColumns.length) {
      this.titleColumn = this.dyColumns.find(
        (d) =>
          d.dataType !== this.DataTypes.Number &&
          d.dataType !== this.DataTypes.Image
      );
    }
    if (data && this.titleColumn && data[this.titleColumn.name]) {
      data.defaultTitle = data[this.titleColumn.name].toString();
    }
    return data.defaultTitle;
  }

  getValueAsArray(data: any): [] {
    return data;
  }

  detectChanges(): void {
    if (this.changeDetector) {
      this.changeDetector.detectChanges();
    }
  }

  onDownloadTable(): void {
    this.dataService.downloadFile(
      `${Modules.TablesUrl}${Operations.Download}`,
      {
        Data: this.tableConfig,
        AdditionalData: this.viewData,
      },
      this.tableConfig.title
    );
  }

  isImageArray = (data: any) => data instanceof Array;
}
