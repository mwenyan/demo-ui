import { OnInit, AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollectionViewer, DataSource, SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl, TreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';

import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BlockchainService } from '../blockchain.service';

import { DatePipe } from '@angular/common';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';


interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
interface TreeNode {
  name: string;
  disabled?: boolean;
  children?: TreeNode[];
}


@Component({
  selector: 'app-carrier',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss']
})
export class CarrierComponent implements OnInit, AfterViewInit{

  getTrackingInfoForm!: FormGroup;
  backendService!: BlockchainService;
  formBuilder!: FormBuilder;
  companyId!: string;
  trackingId!: string;

  // timeline tracking data
  data: any = [];

  // transfer txn detail
  txfDetail = new Map();


  constructor(fb: FormBuilder, svc: BlockchainService) {
    this.formBuilder = fb;
    this.backendService = svc;
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

     this.backendService.getInternalTrackingInfo(this.trackingId, this.companyId).subscribe(
      (val) => {
        this.parseTimelineInfo(val);
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
      info.event = e.eventType.toUpperCase();
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
                                        return (
                                          '<div style="margin:10px">' +
                                          '<span >' +
                                          'minValue: ' + minmax[0] + '<br>' +
                                          'maxValue: ' + minmax[1] + '<br>' +
                                          'Start:    ' + new Date(w.globals.seriesRangeStart[seriesIndex][dataPointIndex]) + '<br>' +
                                          'End:      ' + new Date(w.globals.seriesRangeEnd[seriesIndex][dataPointIndex]) +
                                          '</span>' +
                                          '</div>'
                                        );
                                      },
                                fixed: {
                                        enabled: true,
                                        position: 'topRight',
                                        offsetX: 100,
                                        offsetY: 100,
                                    },
                              }
                            };
          violation.series[0].data.pop();
          let name = '';
          for (const m of route.measurements) {
            const color = m.violated ? '#ff0000' : '#008000';
            const s = {x: 'status', //m.minValue + ':' +  m.maxValue,
                       y: [new Date(m.periodStart).getTime(), new Date(m.periodEnd).getTime()],
                        fillColor: color
                      };
            violation.series[0].data.push(s);
            name = name + m.minValue + ':' + m.maxValue + ',';
          }
          violation.series[0].name = name;
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

  getTransferTxns(item: any): any {
    let txn = this.txfDetail.get(item.txn);

    if (Boolean(txn)) {
      return txn;
    } else {
      this.backendService.getTransferTxnDetail(this.trackingId, item.txn).subscribe(
        (val) => {
          txn = val;
          this.txfDetail.set(item.txn, txn);
          return txn;
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
      if (item.event === 'TRANSFER'){
        item.display = item.source + ', ' + item.target;
      } else {
        item.display = item.source;
      }
    } else if (e.index === 2) {
      item.display = item.containers;
    }

  }
}

