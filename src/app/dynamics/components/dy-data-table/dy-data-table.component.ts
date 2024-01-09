import { DyImportPopupComponent } from './../../popups/dy-import-popup/dy-import-popup.component';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { eExceptions } from '@dynamics/dynamics.constants';
import { IMenuItem, TableConfig } from '@dynamics/dynamics.interface';
import { DyConfirmPopupComponent } from '@dynamics/popups/dy-confirm-popup/dy-confirm-popup.component';
import { DataService } from '@services/data.service';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from '@services/subscriber.service';
import { TableService } from '@services/table.service';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Operations, Urls } from '@urls';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'data-table',
  templateUrl: './dy-data-table.component.html',
  styleUrls: ['./dy-data-table.component.scss'],
  providers: [TableService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyDataTableComponent implements OnDestroy {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('confPopup', { static: true }) confPopup: DyConfirmPopupComponent;
  @ViewChild('impPopup', { static: true }) importPopup: DyImportPopupComponent;

  ColumnMode = ColumnMode;
  cardView = false;
  currentPage = 1;
  filterCount = { count: 0 };
  private subList: SubscriptionObject[] = [];

  @Input()
  set tableConfig(tableConfig: TableConfig) {
    this.tableService.onLoadTable(tableConfig);
  }

  @Input()
  set filterDataConfig(data) {
    if (
      this.tableService.tableConfig &&
      this.tableService.tableConfig.isPreDefined &&
      data
    ) {
      this.tableService.serverFilterValue = data;
      this.tableService.onSelect(this.tableService.tableConfig.dataUrl, false);
    }
  }

  @Input()
  set reload(reload: boolean) {
    if (
      reload &&
      this.tableService.tableConfig &&
      this.tableService.tableConfig.dataUrl
    ) {
      this.tableService.onSelect(this.tableService.tableConfig.dataUrl);
    }
  }

  @Input()
  set accessDetails(menuAccessDetails: IMenuItem) {
    if (menuAccessDetails) {
      this.tableService.accessDetails = menuAccessDetails;
    }
  }

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onEdit: EventEmitter<any> = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onDocument: EventEmitter<any> = new EventEmitter<any>();

  @HostListener('window:resize', ['$event'])
  handleWindowSize(event): void {
    this.resizeWindow();
  }

  constructor(
    private dataService: DataService,
    public tableService: TableService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.tableService.changeDetector = changeDetector;
    this.resizeWindow();
  }

  onEditEvent(id: any): void {
    this.onEdit.emit(this.tableService.originalData.find((r) => r.id === id));
  }

  onDocumentEvent(id: any): void {
    this.onDocument.emit(
      this.tableService.originalData.find((r) => r.id === id)
    );
  }

  onImportEvent(): void {
    this.importPopup.openModal('Are you sure? You want to delete data?');
    this.reload = false;
    pushSubscription(
      'ImportSub',
      this.subList,
      this.importPopup.reloadParent.subscribe((flag) => {
        if (flag) {
          this.reload = true;
        }
      })
    );
  }

  async onDeleteEvent(id: any): Promise<void> {
    const data = this.tableService.originalData.find((r) => r.id === id);
    this.confPopup.openModal('Are you sure? You want to delete data?');
    pushSubscription(
      'DeleteSub',
      this.subList,
      this.confPopup.confirmation.subscribe((flag) => {
        if (flag && this.tableService.tableConfig.dataUrl) {
          this.reload = false;
          this.dataService
            .post<any>(
              Urls.Base +
                this.tableService.tableConfig.dataUrl +
                Operations.Delete,
              data
            )
            .then((response) => {
              if (response.status === eExceptions.Success) {
                this.reload = true;
              }
            });
        }
      })
    );
  }

  resizeWindow(): void {
    if (!this.cardView) {
      this.cardView = window.innerWidth < 992;
    }
  }

  ngOnDestroy(): void {
    destroySubscriptions(this.subList);
  }
}
