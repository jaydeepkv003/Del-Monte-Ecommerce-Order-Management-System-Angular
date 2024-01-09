import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { WidgetConfig } from '@dynamics/dynamics.interface';
import { WidgetDynamicService } from '@services/widget.dynamic.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-wi-tiles',
  templateUrl: './dy-wi-tiles.component.html',
  styleUrls: ['./dy-wi-tiles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WidgetDynamicService],
})
export class DyWiTilesComponent {
  widgetConfig: WidgetConfig;

  @Input() set config(widget: WidgetConfig) {
    if (widget && widget.isActive) {
      this.widgetConfig = widget;
      this.wiService.configure(widget);
    }
  }

  constructor(
    public wiService: WidgetDynamicService<WiTiles[]>,
    private changeDetector: ChangeDetectorRef
  ) {
    this.wiService.changeDetector = changeDetector;
  }
}

export class WiTiles {
  title: string;
  data: string;
  subTitle: string;
  badgeData: string;
  icon: string;
}
