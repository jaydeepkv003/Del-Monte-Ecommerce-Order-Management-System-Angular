import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { BarChartData, WidgetConfig } from '@dynamics/dynamics.interface';
import { ChartService } from '@services/chart.service';
import { Colors } from '@services/colors.service';
import {
  destroySubscriptions,
  pushSubscription,
  SubscriptionObject,
} from '@services/subscriber.service';
import { WidgetDynamicService } from '@services/widget.dynamic.service';
import { Chart } from 'chart.js';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dy-wi-donut',
  templateUrl: './dy-wi-donut.component.html',
  styleUrls: ['./dy-wi-donut.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WidgetDynamicService],
})
export class DyWiDonutComponent implements OnDestroy {
  chart: Chart;
  widgetConfig: WidgetConfig;
  private subList: SubscriptionObject[] = [];
  @ViewChild('chart', { static: true }) chartRef: ElementRef;

  @Input() set config(widget: WidgetConfig) {
    if (widget && widget.isActive) {
      this.widgetConfig = widget;
      this.wiService.configure(widget);
      this.chartConfig();
    }
  }

  constructor(
    public wiService: WidgetDynamicService<BarChartData[]>,
    private changeDetector: ChangeDetectorRef
  ) {
    this.wiService.changeDetector = changeDetector;
    this.eventSubscribe();
  }

  eventSubscribe(): void {
    pushSubscription(
      'BarData',
      this.subList,
      this.wiService.dataSubject.subscribe((data: BarChartData[]) =>
        this.prepareChart(data)
      )
    );
    pushSubscription(
      'LiveBarData',
      this.subList,
      this.wiService.messageSubject.subscribe((message) => {
        if (message) {
          this.wiService.processData();
        }
      })
    );
  }

  chartConfig(): void {
    Chart.defaults.global.datasets.barWithShadow =
      Chart.defaults.global.datasets.bar;
    Chart.defaults.barWithShadow = Chart.defaults.bar;
    Chart.controllers.barWithShadow = Chart.controllers.bar.extend({
      draw(ease: any): void {
        Chart.controllers.bar.prototype.draw.call(this, ease);
        const chartCtx = this.chart.ctx;
        chartCtx.save();
        chartCtx.shadowColor = 'rgba(0,0,0,0.2)';
        chartCtx.shadowBlur = 7;
        chartCtx.shadowOffsetX = 5;
        chartCtx.shadowOffsetY = 7;
        chartCtx.responsive = true;
        Chart.controllers.bar.prototype.draw.apply(this, arguments);
        chartCtx.restore();
      },
    });
  }

  prepareChart(data: BarChartData[]): void {
    const chartRefEl = this.chartRef.nativeElement;
    const ctx = chartRefEl.getContext('2d');
    const barChartOptions = ChartService.barChartOprions;

    let i = 1;
    let minVal = 0;
    let maxVal = 0;
    const viewData = { labels: [], datasets: [] };
    data.forEach((item) => {
      viewData.labels.push(item.identifier);
      item.options.forEach((option) => {
        const optionData = viewData.datasets.find(
          (d) => d.label === option.key
        );
        if (!optionData) {
          viewData.datasets.push({
            label: option.key,
            data: [option.value],
            borderWidth: 2,
            borderColor: Colors.getColors()[`themeColor${i}`],
            backgroundColor: Colors.getColors()[`themeColor${i}_10`],
          });
          i = i === 6 ? 1 : i + 1;
        } else {
          optionData.data.push(option.value);
        }
        minVal = +option.value < minVal ? +option.value : minVal;
        maxVal = +option.value > maxVal ? +option.value : maxVal;
      });
    });

    barChartOptions.scales.yAxes[0].ticks = {
      beginAtZero: true,
      stepSize: Math.floor(maxVal / 5),
      min: minVal,
      max: maxVal,
      padding: 20,
    };

    this.chart = new Chart(ctx, {
      type: 'barWithShadow',
      options: barChartOptions,
      data: viewData,
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    destroySubscriptions(this.subList);
  }
}
