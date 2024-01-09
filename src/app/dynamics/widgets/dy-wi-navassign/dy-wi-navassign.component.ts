import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { eExceptions, PageType } from '@dynamics/dynamics.constants';
import { WidgetOptionType } from '@dynamics/dynamics.enum';
import { IMenuItem, WidgetConfig } from '@dynamics/dynamics.interface';
import { ResourcesService } from '@services/resources.service';
import { destroySubscriptions, pushSubscription, SubscriptionObject } from '@services/subscriber.service';
import { WidgetDynamicService } from '@services/widget.dynamic.service';
import { Urls } from '@urls';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-wi-navassign',
  templateUrl: './dy-wi-navassign.component.html',
  styleUrls: ['./dy-wi-navassign.component.scss'],
  providers: [WidgetDynamicService],
})
export class DyWiNavassignComponent implements OnDestroy {
  widgetConfig: WidgetConfig;
  private subList: SubscriptionObject[] = [];

  PageTypes: any = PageType;
  originalDataList: [];
  originalSubDataList: [];
  userFilter = '';
  userTypeFilter = '';

  dataList: [];
  subDataList: [];

  allSelect = false;
  allCreate = false;
  allView = false;
  allEdit = false;
  allDelete = false;
  selectedUserorType: any;
  navigationData: IMenuItem[] = [];
  isUser = false;

  @Input() set config(widget: WidgetConfig) {
    if (widget && widget.isActive) {
      this.widgetConfig = widget;
      this.wiService.configure(widget);
    }
  }

  constructor(
    public wiService: WidgetDynamicService<any>,
    private changeDetector: ChangeDetectorRef,
    private resourcesService: ResourcesService
  ) {
    this.wiService.changeDetector = changeDetector;
    this.eventSubscribe();
  }

  eventSubscribe(): void {
    pushSubscription(
      'NavAssign',
      this.subList,
      this.wiService.dataSubject.subscribe(() => {
        const dataUrl = this.wiService.getFieldValue(
          this.widgetConfig.widgetOptions,
          WidgetOptionType.PrimaryUrl
        );
        if (dataUrl) {
          this.wiService.dataService
            .postData<[]>(`${Urls.Base}${dataUrl}`)
            .then((data) => {
              this.dataList = data;
              this.originalDataList = JSON.parse(JSON.stringify(data));
              this.wiService.detectChanges();
            });
        }
        const subDataUrl = this.wiService.getFieldValue(
          this.widgetConfig.widgetOptions,
          WidgetOptionType.SecondaryUrl
        );
        if (subDataUrl) {
          this.wiService.dataService
            .postData<[]>(`${Urls.Base}${subDataUrl}`)
            .then((data) => {
              this.subDataList = data;
              this.originalSubDataList = JSON.parse(JSON.stringify(data));
              this.wiService.detectChanges();
            });
        }
      })
    );
  }

  fillPermissions(data, isUser: boolean): void {
    this.isUser = isUser;
    this.resourcesService.addToBreadcrumb([
      isUser ? 'User' : 'User Type',
      isUser ? data.username : data.userType,
    ]);
    this.changeDetector.detectChanges();
    if (this.wiService.widgetData && this.wiService.widgetData.length) {
      this.selectedUserorType = data;
      const assignableData: IMenuItem[] = this.wiService.widgetData.filter(
        (d) => d.childItems.length > 0
      );
      this.navigationData = JSON.parse(JSON.stringify(assignableData));
      this.allSelect = false;
      this.allCreate = false;
      this.allView = false;
      this.allEdit = false;
      this.allDelete = false;
      if (data) {
        this.navigationData.forEach((parent) => {
          this.fillPermissionNavigation(parent, data.navigations);
          parent.childItems.forEach((child) => {
            this.fillPermissionNavigation(child, data.navigations);
            child.childItems.forEach((cchild) => {
              this.fillPermissionNavigation(cchild, data.navigations);
            });
          });
        });
      }
    }
    this.changeDetector.detectChanges();
  }

  fillPermissionNavigation(menu: IMenuItem, navigations: IMenuItem[]): void {
    const item = navigations.find((d) => d.navigationId === menu.id);
    menu.isCreate = item && item.isCreate ? item.isCreate : false;
    menu.isView = item && item.isView ? item.isView : false;
    menu.isEdit = item && item.isEdit ? item.isEdit : false;
    menu.isDelete = item && item.isDelete ? item.isDelete : false;
  }

  allPermission(
    event: any,
    navigations: IMenuItem[],
    operation?: string
  ): void {
    this.allSelect = event.target.checked;
    navigations.forEach((navigation) => {
      this.permission(event, navigation, operation);
    });
    if (!operation) {
      this.allCreate = this.allSelect;
      this.allView = this.allSelect;
      this.allEdit = this.allSelect;
      this.allDelete = this.allSelect;
    }
  }

  permission(event: any, navigation: IMenuItem, operation?: string): void {
    const ischecked = event.target.checked;
    switch (operation) {
      case 'C': {
        navigation.isCreate = ischecked;
        break;
      }
      case 'V': {
        navigation.isView = ischecked;
        break;
      }
      case 'E': {
        navigation.isEdit = ischecked;
        break;
      }
      case 'D': {
        navigation.isDelete = ischecked;
        break;
      }
      default: {
        navigation.isCreate = ischecked;
        navigation.isEdit = ischecked;
        navigation.isView = ischecked;
        navigation.isDelete = ischecked;
        break;
      }
    }
    this.applyChildren(event, navigation, operation);
    this.wiService.detectChanges();
  }

  applyChildren(event: any, navigation: IMenuItem, operation?: string): void {
    const ischecked = event.target.checked;
    if (navigation.childItems && navigation.childItems.length) {
      navigation.childItems.forEach((child) => {
        this.permission(event, child, operation);
      });
    }
  }

  stopProp(event): void {
    event.stopPropagation();
  }

  saveData(): void {
    const dataUrl = this.wiService.getFieldValue(
      this.widgetConfig.widgetOptions,
      this.isUser ? WidgetOptionType.SubUrl : WidgetOptionType.SaveUrl
    );
    if (dataUrl) {
      this.selectedUserorType.navigations = [];
      this.navigationData.forEach((parent) => {
        this.selectedUserorType.navigations.push({
          ...parent,
          id: 0,
          navigationId: parent.id,
        });
        parent.childItems.forEach((child) => {
          this.selectedUserorType.navigations.push({
            ...child,
            id: 0,
            navigationId: child.id,
          });
          child.childItems.forEach((cchild) => {
            this.selectedUserorType.navigations.push({
              ...cchild,
              id: 0,
              navigationId: cchild.id,
            });
          });
        });
      });

      this.wiService.dataService
        .post<any>(`${Urls.Base}${dataUrl}`, this.selectedUserorType)
        .then((response) => {
          if (response.status === eExceptions.Success) {
            this.eventSubscribe();
            this.selectedUserorType = {};
            this.navigationData = [];
            this.userFilter = '';
            this.userTypeFilter = '';
            this.resourcesService.addToBreadcrumb(null);
          }
        });
    }
  }

  userTypeFilterFn(filter: string): void {
    if (filter) {
      const val = filter.toLowerCase().trim();
      const temp: any = this.originalDataList.filter((item: any) => {
        return item.userType.toLowerCase().indexOf(val) !== -1;
      });
      this.dataList = temp;
    } else {
      this.dataList = this.originalDataList;
    }
    this.wiService.detectChanges();
  }

  userFilterFn(filter: string): void {
    if (filter) {
      const val = filter.toLowerCase().trim();
      const temp: any = this.originalSubDataList.filter((item: any) => {
        return item.username.toLowerCase().indexOf(val) !== -1;
      });
      this.subDataList = temp;
    } else {
      this.subDataList = this.originalSubDataList;
    }
    this.wiService.detectChanges();
  }

  ngOnDestroy(): void {
    destroySubscriptions(this.subList);
  }
}
