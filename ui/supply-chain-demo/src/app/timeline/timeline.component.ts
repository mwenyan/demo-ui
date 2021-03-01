import { OnInit, AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BlockchainService } from '../blockchain.service';

import { DatePipe } from '@angular/common';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, AfterViewInit{

  getTrackingInfoForm!: FormGroup;
  trackingId!: string;

  // timeline tracking data
  data: any = [];
  dataStatus = '';

  // transfer txn detail
  txfDetail = new Map();


  constructor(private formBuilder: FormBuilder, private backendService: BlockchainService) {
  }

  ngOnInit(): void {
    this.getTrackingInfoForm = this.formBuilder.group({
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

     this.trackingId = this.getTrackingInfoForm.value.trackingId;
     this.data = [];
     this.dataStatus = '';
     this.txfDetail.clear();
     this.backendService.getTimeline(this.trackingId).subscribe(
      (val) => {
        if (Boolean(val)){
          this.parseTimelineInfo(val);
        } else {
          this.dataStatus = 'Package is not found';
        }
      },
      response => {
        console.log('error =', response);
      },
      () => {
        console.log('completed');
      }
     );
  }

  protected parseTimelineInfo(val: any): void {
    const routes = new Map();
    for (const r of val.routes){
      routes.set (r.routeNbr, r);
    }

    // tslint:disable-next-line:forin
    for (const i in val.timeline) {
      const e = val.timeline[i];
      const info: any = {};

      if (Boolean(e.route)){
        info.source = e.route.substring(0, 3);
      }
      info.txn = val.uid;

      const datepipe: DatePipe = new DatePipe('en-US');
      // tslint:disable-next-line:no-non-null-assertion
      info.date = datepipe.transform(e.eventTime, 'EEEE, MMMM d, y, h:mm:ss a')!;
      info.location = e.location.substring(5);
      info.event = e.eventType;
      info.icon = 'normal';
      switch (e.eventType){
        case 'pickup':
          info.location = e.location;
          info.description = 'Package picked up at ' + e.location;
          info.icon = 'home';
          break;
        case 'depart':
          if (val.timeline[Number(i) + 1].eventType === 'arrive'){
            info.description = 'Package departed ' + info.location;
          } else {
            info.description = 'Package departed ' + info.location + ', out for delivery';
          }
          break;
        case 'arrive':
          info.description = 'Package arrived at ' + info.location ;
          break;
        case 'transfer':
          info.source = e.location.substring(0, 3);
          info.target = val.timeline[Number(i) + 1].location.substring(0, 3);
          info.description = 'Package transferred from ' + info.source + ' to ' + info.target + ' at ' + info.location;
          info.icon = 'transfer';

          break;
        case 'deliver':
          info.location = e.location;
          info.icon = 'home';
          info.description = 'Package delivered to ' + e.location;
      }

      if (e.eventType !== 'transferAck'){
        info.display = info.description;
        this.data.push(info);
      }

      if (Boolean (e.route)) {
        info.route = e.route;
        const route = routes.get(e.route);

        // check for violation
        if (route.violated && !Boolean(route.used)){
          const violation = {
                              icon: 'alert',
                              periods: [''],
                              chart: {height: 150, width: '100%', type: 'rangeBar', toolbar: {show: false}},
                              title: { text: 'Temperature Changes'},
                              series: [{name: '', data: [{}]}],
                              xaxis: {type: 'datetime'},
                              yaxis: {show: true, labels: {show: true}},
                              options: { bar: {horizontal: true, barHeight: '50%'}},
                              tooltip: {
                                custom: ( { series, seriesIndex, dataPointIndex, w }: any) => {
                                        //const minmax = w.globals.seriesX[seriesIndex][dataPointIndex].split(':');
                                        const minmax = w.globals.seriesNames[seriesIndex].split(',')[dataPointIndex].split(':');
                                        const datep: DatePipe = new DatePipe('en-US');
                                        // tslint:disable-next-line:no-non-null-assertion
                                        const start = datep.transform(new Date(w.globals.seriesRangeStart[seriesIndex][dataPointIndex]), 'EEEE, MMMM d, y, h:mm:ss a z');
                                        const end = datep.transform(new Date(w.globals.seriesRangeEnd[seriesIndex][dataPointIndex]), 'EEEE, MMMM d, y, h:mm:ss a z');

                                        return (
                                          '<div style="margin:10px">' +
                                          '<span >' +
                                          'Temperature Range: ' + minmax[0] + ' to ' + minmax[1] + '<br>' +
                                          'Start:    ' + start + '<br>' +
                                          'End:      ' + end +
                                          '</span>' +
                                          '</div>'
                                        );
                                      },
                                fixed: {
                                        enabled: false,
                                        position: 'topRight',
                                        offsetX: 10,
                                        offsetY: 10,
                                    },
                              }
                            };
          violation.series[0].data.pop();
          let name = '';
          const violationPeriods: string[] = [];
          for (const m of route.measurements) {
            const color = m.violated ? '#ff0000' : '#008000';
            if (m.violated) {
              violationPeriods.push(m.periodStart);
            }

            const s = {x: 'status',
                       y: [new Date(m.periodStart).getTime(), new Date(m.periodEnd).getTime()],
                        fillColor: color
                      };
            violation.series[0].data.push(s);
            name = name + m.minValue + ':' + m.maxValue + ',';
          }
          violation.series[0].name = name;
          violation.periods = violationPeriods;
          route.used = true;
          this.data.push(violation);
        }

        // set containers
        info.hasContainers = true;
        info.containers = route.containers.replace(/\./g, ' <-- ');
      } else {
        info.hasContainers = false;
      }
    }
  }

  ngAfterViewInit(): void {}

  getBlockchainTxn(uid: string, event: string): any {
    const txn = this.txfDetail.get(uid + '-' + event);

    if (Boolean(txn)) {
      return txn;
    } else {
      this.backendService.getBlockchainTxn(uid, event).subscribe(
        (val) => {
          this.txfDetail.set(uid + '-' + event, val);
          return val;
        },
        response => {
          console.log('error =', response);
        },
        () => {
          console.log('completed');
        }
      );
    }
  }

  getBlockchainViolation(item: any): any {
    const txn = this.txfDetail.get(item.txn + '-' + item.periods[0]);

    if (Boolean(txn)) {
      return txn;
    } else {
      const data = { violations: [{}]};
      this.backendService.getBlockchainViolation(this.trackingId, item.periods).subscribe(
        (vals) => {
          data.violations.pop();

          // tslint:disable-next-line:forin
          for (const i in item.periods){
            const v = {'period-start': item.periods[i], transaction: vals[Number(i)]};
            data.violations.push(v);
          }

          this.txfDetail.set(item.txn + '-' + item.periods[0], data);
          return data;
        },
        response => {
          console.log('error =', response);
        },
        () => {
          console.log('completed');
        }
      );
    }
  }

  getCardContent(e: NzTabChangeEvent, item: any): void {
    if (e.index === 0){
      item.display = item.description;
    } else if (e.index === 1){
      if (item.event === 'transfer'){
        item.display = item.source + ', ' + item.target;
      } else {
        item.display = item.source;
      }
    } else if (e.index === 2) {
      item.display = item.containers;
    } else {
      item.display = '';
    }

  }
}

