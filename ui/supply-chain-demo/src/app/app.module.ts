import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { TimelineComponent } from './timeline/timeline.component';
import { SenderComponent } from './sender/sender.component';

import { MaterialDesignModule } from '../material-design/material-design.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BlockchainService } from './blockchain.service';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment.mock';
import { MockModule } from 'src/mock/mock.module';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';

import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
registerLocaleData(en);

import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { MapComponent } from './map/map.component';
import { MapService } from './map/_services/map-service.service';


//const extraModules = environment.mockApi ? [MockModule] : [];

@NgModule({
  declarations: [
    AppComponent,
    SenderComponent,
    TimelineComponent,
    MapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialDesignModule,
    HttpClientModule,
  //  ...extraModules,
    FormsModule,
    NzTimelineModule,
    NzIconModule,
    NzSpaceModule,
    NzFormModule,
    NzCollapseModule,
    NgApexchartsModule,
    NgxJsonViewerModule,
    NzCardModule,
    NzTabsModule,
    NzSpinModule,
  ],
  providers: [BlockchainService, MapService, { provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
