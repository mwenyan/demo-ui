import { OnInit, Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';
import { MapService } from './_services/map-service.service';
import {statesData } from './us-states';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BlockchainService } from '../blockchain.service';
import { DatePipe } from '@angular/common';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  static map: L.Map;
  getTrackingInfoForm!: FormGroup;
  trackingId!: string;
  // timeline tracking data
  data: any = [];
  dataStatus = '';
  polylines: any = [];

  static getColor(d: number): string {
    return d > 1000 ? '#800026' :
          d > 500  ? '#BD0026' :
          d > 200  ? '#E31A1C' :
          d > 100  ? '#FC4E2A' :
          d > 50   ? '#FD8D3C' :
          d > 20   ? '#FEB24C' :
          d > 10   ? '#FED976' :
                      '#FFEDA0';
  }

  static style(feature: any): L.GeoJSONOptions {
    const options: any = {
        fillColor: MapComponent.getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
    return  options;
  }

  constructor(private mapService: MapService, private formBuilder: FormBuilder, private backendService: BlockchainService) { }

  ngOnInit(): void {
    this.getTrackingInfoForm = this.formBuilder.group({
      trackingId: [null, [Validators.required]],
      remember: [true]
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const maxBoundsV = L.latLngBounds(
        L.latLng(5.499550, -167.276413), // Southwest
        L.latLng(83.162102, -52.233040)  // Northeast
    );

    MapComponent.map = L.map('map', {
      center: [ 39.8282, -98.5795 ],
    //  center: [0, 0],
      zoom: 5
    });

    const accessToken = 'pk.eyJ1IjoibXdvbmxpbmU4ODgiLCJhIjoiY2tsc3R4MWN2MjBkcTJ2a2Q2aDJndHF2YyJ9.F7bI8GmHMs5iTAMsVG-nNQ';
    const url = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + accessToken;
    // url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const tiles = L.tileLayer(url, {
          id: 'mapbox/light-v9',
          tileSize: 512,
          zoomOffset: -1,
          attribution: 'mapbox'
      });

    tiles.addTo(MapComponent.map);
    L.geoJSON(statesData, {style: MapComponent.style}).addTo(MapComponent.map);
  }


  getTrackingInfo(): void {
    // tslint:disable-next-line:forin
    for (const i in this.getTrackingInfoForm.controls) {
     this.getTrackingInfoForm.controls[i].markAsDirty();
     this.getTrackingInfoForm.controls[i].updateValueAndValidity();
   }

    this.trackingId = this.getTrackingInfoForm.value.trackingId;
    this.data = [];
    this.polylines = [];
    this.dataStatus = '';

    this.backendService.getTimeline(this.trackingId).subscribe(
     (val) => {
       if (Boolean(val)){
         this.parseTimelineInfo(val);
         this.mapService.addMarkers(MapComponent.map, this.data);
         this.mapService.addLines(MapComponent.map, this.polylines);
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

  private parseTimelineInfo(val): void {
    const routes = new Map();

    const datepipe: DatePipe = new DatePipe('en-US');
    const markerMap = new Map();
    let markerCount = 0;
    // tslint:disable-next-line:forin
    for (const i in val.timeline) {
      const e = val.timeline[i];
      const info: any = {};
      let props: any = [];
      const prop: any = {};

      // tslint:disable-next-line:no-non-null-assertion
      prop.date = datepipe.transform(e.eventTime, 'EEEE, MMMM d, y, h:mm:ss a')!;
      prop.location = e.location.substring(5);
      prop.event = e.eventType;

      if (Boolean(markerMap.get(e.latitude + '_' + e.longitude))) {
        props = this.data[markerMap.get(e.latitude + '_' + e.longitude)].properties;
        props.push(prop);
      } else {
        markerMap.set(e.latitude + '_' + e.longitude, markerCount);
        markerCount++;
        info.coordinates = [e.latitude, e.longitude];
        props.push(prop);
        info.properties = props;
        this.data.push(info);
      }

      let line: any = {};
      if (Boolean(e.route)) {
        if (Boolean(routes.get(e.route))) {
          line = routes.get(e.route);
          line.end = [e.latitude, e.longitude];
        } else {
          line.start = [e.latitude, e.longitude];
        }
        routes.set(e.route, line);
      }
    }

    for (const r of val.routes){
      const line = routes.get(r.routeNbr);
      line.violated = r.violated;
      if (r.violated) {
        for (const m of r.measurements) {
          if (m.violated) {
            line.measurement = m;
          }
        }
      }
      this.polylines.push(line);
    }
  }
}
