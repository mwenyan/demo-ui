import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-polylinedecorator';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() {
  }

  addMarkers(map: L.Map, markers: any[]): void {
    let i = 0;
    for (const geo of markers) {
        const marker = L.circleMarker([geo.coordinates[0], geo.coordinates[1]], {radius:  4, fillColor: 'blue', color: 'blue'});


        let content = '<div>';
        for (const p of geo.properties) {
          content = content + '<div><p><b>event:    </b>' + p.event + '<br><b>location: </b>' + 
                    p.location + '<br><b>time:     </b>' + p.date + '</p>';
        }
        content = content + '</div>';
        marker.bindPopup(content).openPopup();
        marker.bindTooltip(i.toString(),
                    {className: 'tooltip-demo', permanent: true, direction: i % 2 ? 'left' : 'right'}).openTooltip();
        marker.addTo(map);
        i++;
      }
  }

  addLines(map: L.Map, lines: any[]): void {
    for (const l of lines) {
      const pl = L.polyline([l.start, l.end],
         {color: l.violated ? 'red' : 'blue', weight: 3}).addTo(map);

      if (l.violated) {
        let content = '<div>';
        content = content + '<p><b>Constraint Violation</b></p><p><b>start: </b>' + l.measurement.periodStart + 
                  '<br><b>end: </b>' + l.measurement.periodEnd + 
                  '<br><b>violation: </b>' + l.measurement.minValue + ' <b>to</b> ' + l.measurement.maxValue + '</p>';
        content = content + '</div>';
        pl.bindTooltip(content, {sticky: true, direction: 'top'}).openTooltip();
      }

      const decorator = L.polylineDecorator(pl, {
      patterns: [
          // defines a pattern of 10px-wide dashes, repeated every 20px on the line
          {offset: 0, repeat: 50, symbol: L.Symbol.arrowHead({pixelSize: 5, polygon: false,
              pathOptions: {stroke: true, color: 'black', weight: 3, opacity: 1}})}
      ]
      });
      decorator.addTo(map);
    }
  }
}
