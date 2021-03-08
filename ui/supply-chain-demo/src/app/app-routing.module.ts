import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SenderComponent } from './sender/sender.component';
import { MapComponent } from './map/map.component';
import { TimelineComponent} from './timeline/timeline.component';

const routes: Routes = [
  { path: 'sender', component: SenderComponent },
  { path: 'timeline', component: TimelineComponent },
  { path: 'routes', component: MapComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
