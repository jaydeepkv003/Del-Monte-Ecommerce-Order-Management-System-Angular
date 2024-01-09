import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { WidgetOptionType } from '@dynamics/dynamics.enum';
import { WidgetConfig } from '@dynamics/dynamics.interface';
import { DyScannerPopupComponent } from '@dynamics/popups/dy-scanner-popup/dy-scanner-popup.component';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from '@services/subscriber.service';
import { WidgetDynamicService } from '@services/widget.dynamic.service';
import { Modules } from '@urls';
import { eExceptions } from '@dynamics/dynamics.constants';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-wi-entryexit',
  templateUrl: './dy-wi-entryexit.component.html',
  styleUrls: ['./dy-wi-entryexit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WidgetDynamicService],
})
export class DyWiEntryexitComponent implements OnDestroy {
  @ViewChild('scanner', { static: true }) scanner: DyScannerPopupComponent;
  widgetConfig: WidgetConfig;
  isEntry: boolean;
  private subList: SubscriptionObject[] = [];
  entryExitData: any;
  entryExitMessage: string;
  selectedData: any;
  searchData: string;
  isSearchOn = false;
  userList: any;
  userSearch: string;
  searchHit: boolean;

  @Input() set config(widget: WidgetConfig) {
    if (widget && widget.isActive) {
      this.widgetConfig = widget;
      this.wiService.configure(widget);
    }
  }

  constructor(
    public wiService: WidgetDynamicService<any>,
    private changeDetector: ChangeDetectorRef
  ) {
    this.wiService.changeDetector = changeDetector;
    this.selectedData = null;
    this.isEntry = null;
    this.userList = null;
    this.searchHit = false;
  }

  onSelectDoor(data): void {
    this.selectedData = data;
    this.searchHit = true;
  }

  onSelectEntryExit(data): void {
    this.isEntry = data;
    // this.openScannerPopup();
  }

  onSearchToggle(doorId): void {
    this.isSearchOn = !this.isSearchOn;
    this.entryExitData = null;
    this.entryExitMessage = null;
    if (this.isSearchOn && this.searchHit) {
      if (doorId) {
        const dataUrl = this.wiService.getFieldValue(
          this.widgetConfig.widgetOptions,
          WidgetOptionType.SecondaryUrl
        );
        if (dataUrl) {
          this.wiService.dataService
            .post<any>(Modules.Base + dataUrl, {
              data: doorId,
            })
            .then((data) => {
              if (data.status === eExceptions.Success) {
                this.userList = data.data;
                this.searchHit = false;
              }
              this.wiService.detectChanges();
            });
        }
      } else {
        this.userList = null;
      }
      this.wiService.detectChanges();
    }
  }

  onSelectFromSearch(code): void {
    this.getEntryExitData(code);
    this.isSearchOn = false;
  }

  onBack(): void {
    if (this.isEntry === null) {
      this.selectedData = null;
    } else if (this.isEntry != null && !this.isSearchOn) {
      this.isEntry = null;
      this.entryExitData = null;
      this.entryExitMessage = null;
    } else if (this.isSearchOn === true) {
      this.isSearchOn = false;
    }
  }

  openScannerPopup(): void {
    this.scanner.show();
    pushSubscription(
      'ScannedCode',
      this.subList,
      this.scanner.submit.subscribe((code) => {
        this.getEntryExitData(code);
      })
    );
    this.wiService.detectChanges();
  }

  getEntryExitData(code: string): void {
    if (code) {
      const dataUrl = this.wiService.getFieldValue(
        this.widgetConfig.widgetOptions,
        WidgetOptionType.PrimaryUrl
      );
      if (dataUrl) {
        this.wiService.dataService
          .post<any>(Modules.Base + dataUrl, {
            QrCode: code,
            DoorId: this.selectedData.id,
            IsEntry: this.isEntry,
          })
          .then((data) => {
            if (data.status === eExceptions.Success) {
              this.entryExitData = data.data;
              this.entryExitMessage = data.message;
            }
            this.wiService.detectChanges();
          });
      }
    } else {
      this.entryExitData = null;
    }
    this.wiService.detectChanges();
  }

  ngOnDestroy(): void {
    destroySubscriptions(this.subList);
  }
}
