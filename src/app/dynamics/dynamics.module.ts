import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicsService } from '@services/dynamics.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ArchwizardModule } from 'angular-archwizard';
import { EmailEditorModule } from 'angular-email-editor';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BootstrapModule } from './bootstrap.module';
import { DyButtonComponent } from './components/dy-button/dy-button.component';
import { DyCheckboxComponent } from './components/dy-checkbox/dy-checkbox.component';
import { DyDataTableComponent } from './components/dy-data-table/dy-data-table.component';
import { DyIconSelectComponent } from './components/dy-icon-select/dy-icon-select.component';
import { DyImageBoxComponent } from './components/dy-image-box/dy-image-box.component';
import { DyInputComponent } from './components/dy-input/dy-input.component';
import { DyMultiselectListComponent } from './components/dy-multiselect-list/dy-multiselect-list.component';
import { DyMultiselectComponent } from './components/dy-multiselect/dy-multiselect.component';
import { DyPickDateComponent } from './components/dy-pick-date/dy-pick-date.component';
import { DyPickFileComponent } from './components/dy-pick-file/dy-pick-file.component';
import { DySelectComponent } from './components/dy-select/dy-select.component';
import { DySwitchComponent } from './components/dy-switch/dy-switch.component';
import { DyTextareaComponent } from './components/dy-textarea/dy-textarea.component';
import { DyFormExtendedComponent } from './forms/dy-form-extended/dy-form-extended.component';
import { DyFormFieldDirective } from './forms/dy-form-field/dy-form-field.directive';
import { DyFormModelComponent } from './forms/dy-form-model/dy-form-model.component';
import { DyFormPopupComponent } from './forms/dy-form-popup/dy-form-popup.component';
import { DyFormSimpleComponent } from './forms/dy-form-simple/dy-form-simple.component';
import { DyDashPageComponent } from './pages/dy-dash-page/dy-dash-page.component';
import { DyExtPageComponent } from './pages/dy-ext-page/dy-ext-page.component';
import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { FilterPaginatePipe } from './pipes/filter.paginate.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { SafehtmlPipe } from './pipes/safehtml.pipe';
import { SafeUrlPipe } from './pipes/safeurl.pipe';
import { DyCodeScanPopupComponent } from './popups/dy-code-scan-popup/dy-code-scan-popup.component';
import { DyConfirmPopupComponent } from './popups/dy-confirm-popup/dy-confirm-popup.component';
import { DyDocumentPopupComponent } from './popups/dy-document-popup/dy-document-popup.component';
import { DyInputPopupComponent } from './popups/dy-input-popup/dy-input-popup.component';
import { DyScannerPopupComponent } from './popups/dy-scanner-popup/dy-scanner-popup.component';
import { DyOptionlistPopupComponent } from './popups/uncompleted/dy-optionlist-popup/dy-optionlist-popup.component';
import { DyPinPopupComponent } from './popups/uncompleted/dy-pin-popup/dy-pin-popup.component';
import { DyAlphabetComponent } from './shared/dy-alphabet/dy-alphabet.component';
import { DyBreadcrumbComponent } from './shared/dy-breadcrumb/dy-breadcrumb.component';
import { DyDocumentComponent } from './shared/dy-document/dy-document.component';
import { DyMenuComponent } from './shared/dy-menu/dy-menu.component';
import { DyOptionListComponent } from './shared/dy-option-list/dy-option-list.component';
import { TplButtonComponent } from './shared/tpl-button/tpl-button.component';
import { DyWiBarComponent } from './widgets/charts/dy-wi-bar/dy-wi-bar.component';
import { DyWiDatasetComponent } from './widgets/charts/dy-wi-dataset/dy-wi-dataset.component';
import { DyWiDonutComponent } from './widgets/charts/dy-wi-donut/dy-wi-donut.component';
import { DyWiPieComponent } from './widgets/charts/dy-wi-pie/dy-wi-pie.component';
import { DyWiButtonComponent } from './widgets/dy-wi-button/dy-wi-button.component';
import { DyWiEntryexitComponent } from './widgets/dy-wi-entryexit/dy-wi-entryexit.component';
import { DyWiListComponent } from './widgets/dy-wi-list/dy-wi-list.component';
import { DyWiLiveUserComponent } from './widgets/dy-wi-live-user/dy-wi-live-user.component';
import { DyWiNavassignComponent } from './widgets/dy-wi-navassign/dy-wi-navassign.component';
import { DyWiTilesComponent } from './widgets/dy-wi-tiles/dy-wi-tiles.component';
import { DyWidgetsDirective } from './widgets/dy-widgets/dy-widgets.directive';
import { DyWiOrderComponent } from './widgets/ecom/dy-wi-order/dy-wi-order.component';
import { DyWiPosInvComponent } from './widgets/ecom/dy-wi-pos-inv/dy-wi-pos-inv.component';
import { DyCustPopupComponent } from './widgets/ecom/dy-wi-pos/dy-cust-popup/dy-cust-popup.component';
import { DyWiPosComponent } from './widgets/ecom/dy-wi-pos/dy-wi-pos.component';
import { DyWiInfoboxComponent } from './widgets/uncomplete/dy-wi-infobox/dy-wi-infobox.component';
import { DyWiProfileComponent } from './widgets/uncomplete/dy-wi-profile/dy-wi-profile.component';
import { DyWiTableComponent } from './widgets/uncomplete/dy-wi-table/dy-wi-table.component';
import { DyWiLineComponent } from './widgets/charts/dy-wi-line/dy-wi-line.component';
import { DyImportPopupComponent } from './popups/dy-import-popup/dy-import-popup.component';

@NgModule({
  declarations: [
    DyButtonComponent,
    DyCheckboxComponent,
    DyDataTableComponent,
    DyIconSelectComponent,
    DyImageBoxComponent,
    DyInputComponent,
    DyMultiselectComponent,
    DyPickDateComponent,
    DyPickFileComponent,
    DySelectComponent,
    DySwitchComponent,
    DyTextareaComponent,
    DyFormSimpleComponent,
    DyFormPopupComponent,
    DyDashPageComponent,
    DyConfirmPopupComponent,
    DyOptionlistPopupComponent,
    DyPinPopupComponent,
    DyBreadcrumbComponent,

    DyFormFieldDirective,
    DyWidgetsDirective,

    EllipsisPipe,
    SafeUrlPipe,
    FilterPipe,

    DyWiTilesComponent,
    DyWiButtonComponent,
    DyWiInfoboxComponent,
    DyWiLiveUserComponent,
    DyWiProfileComponent,
    DyWiTableComponent,
    DyWiPosComponent,
    DyWiNavassignComponent,
    DyMenuComponent,
    DyWiPosInvComponent,
    DyCodeScanPopupComponent,
    DyInputPopupComponent,
    TplButtonComponent,
    DyCustPopupComponent,
    DyAlphabetComponent,
    DyWiEntryexitComponent,
    DyScannerPopupComponent,
    DyFormExtendedComponent,
    DyFormModelComponent,
    DyExtPageComponent,
    DyDocumentComponent,
    DyDocumentPopupComponent,
    DyWiDatasetComponent,
    DyWiPieComponent,
    DyWiDonutComponent,
    SafehtmlPipe,
    FilterPaginatePipe,
    DyMultiselectListComponent,
    DyWiBarComponent,
    DyOptionListComponent,
    DyWiListComponent,
    DyWiOrderComponent,
    DyWiLineComponent,
    DyImportPopupComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    BootstrapModule,
    NgSelectModule,
    NgxDatatableModule,
    DropzoneModule,
    RoundProgressModule,
    PerfectScrollbarModule,
    ZXingScannerModule,
    EmailEditorModule,
    ArchwizardModule,
  ],
  exports: [
    DyFormSimpleComponent,
    DyFormPopupComponent,
    DyExtPageComponent,
    DyDashPageComponent,
    DyAlphabetComponent,
    SafehtmlPipe,
  ],
  providers: [DynamicsService],
})
export class DynamicsModule { }
