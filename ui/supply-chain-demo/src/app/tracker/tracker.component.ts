import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from 'ng-apexcharts';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-tracker',
  templateUrl: '../templates/states.component.html',
  styleUrls: ['../templates/states.component.scss']
})
export class TrackerComponent implements OnInit{
  getTrackingInfoForm!: FormGroup;

  // timeline tracking data
  data = [
    {color: 'blue', date: 'Wednesday, Jan 20, 2021', time: '10:57 AM', description: 'Racing car sprays burning fuel into crowd.', location: 'Windermere, FL', source: 'NLS'},
    {color: 'blue', date: 'Wednesday, Jan 20, 2021', time: '10:57 AM', description: 'Japanese princess to wed commoner.', location: 'Windermere, FL', source: 'NSL'},
    {color: 'blue', date: 'Wednesday, Jan 20, 2021', time: '10:57 AM', description: 'Australian walks 100km after outback crash.', location: 'Windermere, FL', source: 'SLS'},
    {color: 'red', date: 'Wednesday, Jan 20, 2021', time: '10:57 AM', description: 'Man charged over missing wedding girl.', location: 'Windermere, FL',  source: 'sensor'},
    {color: 'blue', date: 'Wednesday, Jan 20, 2021', time: '10:57 AM', description: 'Los Angeles battles huge wildfires.', location: 'Windermere, FL', source: 'SLS'}
  ];

  // show constraint violations collapse panel.
  panels = [
    {
      active: false,
      name: 'Violation Details'
    }
  ];

  chartData = [];
  chartType = 'line';
  // @ViewChild('chart', {static: false}) chart: ChartComponent;

  chartOptions: Partial<any> = {};

  loadJSONChart(): void {
    const dataArray = [-70, -70.5, -67, -66, -65, -64];
    const dataArray2 = [-72, -72, -72, -72, -72, -72];
    const dataArray3 = [-65, -65, -65, -65, -65, -65];
    const dataLabel = ['2/1/2021 10:00:00', '2/1/2021 22:00:00', '2/2/2021 10:00:00', '2/2/2021 22:00:00', '2/3/2021 10:00:00', '2/3/2021 22:00:00'];

    this.chartOptions = {
      series: [
        {
          name: 'actual',
          data: dataArray
        },
        {
          name: 'min-value',
          data: dataArray2,
          stroke: {
            dashArray: 2
          }
        },
        {
          name: 'max-value',
          data: dataArray3
        },
      ],
      chart: {
        height: 200,
        type: this.chartType
      },
      title: {
        text: `Temperature Flucturation Over Time`
      },
      xaxis: {
        type: 'datetime',
        categories: dataLabel,
        labels: {
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMM \'yy',
            day: 'dd MMM',
            hour: 'HH:mm'
          },
          format: 'HH/dd',
        }
      }
    };
  }
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getTrackingInfoForm = this.fb.group({
      trackingId: [null, [Validators.required]],
      remember: [true]
    });
  }

  getTrackingInfo(): void {
    // tslint:disable-next-line:forin
    for (const i in this.getTrackingInfoForm.controls) {
      this.getTrackingInfoForm.controls[i].markAsDirty();
      this.getTrackingInfoForm.controls[i].updateValueAndValidity();
    }
  }
}
