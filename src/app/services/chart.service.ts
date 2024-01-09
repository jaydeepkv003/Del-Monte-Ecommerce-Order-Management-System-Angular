import { Injectable } from '@angular/core';
import { Colors } from './colors.service';

@Injectable({ providedIn: 'root' })
export class ChartService {
  public static chartTooltip = {
    backgroundColor: Colors.getColors().foregroundColor,
    titleFontColor: Colors.getColors().primaryColor,
    borderColor: Colors.getColors().separatorColor,
    borderWidth: 0.5,
    bodyFontColor: Colors.getColors().primaryColor,
    bodySpacing: 10,
    xPadding: 15,
    yPadding: 15,
    cornerRadius: 0.15,
  };

  public static barChartOprions = {
    legend: {
      position: 'bottom',
      labels: {
        padding: 30,
        usePointStyle: true,
        fontSize: 12,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          gridLines: {
            display: true,
            lineWidth: 1,
            color: 'rgba(0,0,0,0.1)',
            drawBorder: false,
          },
          ticks: {},
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
    },
    tooltips: ChartService.chartTooltip,
  };

  public static lineChartOption = {
    legend: {
      display: false,
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: false,
      },
    },
    scales: {
      yAxes: [
        {
          gridLines: {
            display: true,
            lineWidth: 1,
            color: 'rgba(0,0,0,0.1)',
            drawBorder: false,
          },
          ticks: {},
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
    },
    tooltips: ChartService.chartTooltip,
  };
}
