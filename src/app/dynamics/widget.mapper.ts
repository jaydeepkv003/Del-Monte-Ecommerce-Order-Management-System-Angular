import { DyWiBarComponent } from './widgets/charts/dy-wi-bar/dy-wi-bar.component';
import { DyWiDatasetComponent } from './widgets/charts/dy-wi-dataset/dy-wi-dataset.component';
import { DyWiDonutComponent } from './widgets/charts/dy-wi-donut/dy-wi-donut.component';
import { DyWiLineComponent } from './widgets/charts/dy-wi-line/dy-wi-line.component';
import { DyWiPieComponent } from './widgets/charts/dy-wi-pie/dy-wi-pie.component';
import { DyWiButtonComponent } from './widgets/dy-wi-button/dy-wi-button.component';
import { DyWiEntryexitComponent } from './widgets/dy-wi-entryexit/dy-wi-entryexit.component';
import { DyWiListComponent } from './widgets/dy-wi-list/dy-wi-list.component';
import { DyWiLiveUserComponent } from './widgets/dy-wi-live-user/dy-wi-live-user.component';
import { DyWiNavassignComponent } from './widgets/dy-wi-navassign/dy-wi-navassign.component';
import { DyWiTilesComponent } from './widgets/dy-wi-tiles/dy-wi-tiles.component';
import { DyWiOrderComponent } from './widgets/ecom/dy-wi-order/dy-wi-order.component';
import { DyWiPosInvComponent } from './widgets/ecom/dy-wi-pos-inv/dy-wi-pos-inv.component';
import { DyWiPosComponent } from './widgets/ecom/dy-wi-pos/dy-wi-pos.component';
import { DyWiInfoboxComponent } from './widgets/uncomplete/dy-wi-infobox/dy-wi-infobox.component';
import { DyWiProfileComponent } from './widgets/uncomplete/dy-wi-profile/dy-wi-profile.component';
import { DyWiTableComponent } from './widgets/uncomplete/dy-wi-table/dy-wi-table.component';

export const WidgetMapper = {
  InfoTiles: DyWiTilesComponent,
  LiveUsers: DyWiLiveUserComponent,
  DataTable: DyWiTableComponent,
  FormButton: DyWiButtonComponent,
  Infobox: DyWiInfoboxComponent,
  UserProfile: DyWiProfileComponent,
  NavAssign: DyWiNavassignComponent,
  EntryExit: DyWiEntryexitComponent,
  List: DyWiListComponent,

  PointOfSell: DyWiPosComponent,
  PointOfStock: DyWiPosInvComponent,
  PointOfOrder: DyWiOrderComponent,

  BarChart: DyWiBarComponent,
  LineChart: DyWiLineComponent,
  DatasetChart: DyWiDatasetComponent,
  PieChart: DyWiPieComponent,
  DonutChart: DyWiDonutComponent,
};
