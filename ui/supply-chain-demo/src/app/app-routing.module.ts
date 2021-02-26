import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SenderComponent } from './sender/sender.component';
import { CarriernComponent} from './carriern/carriern.component';
import { CarriersComponent} from './carriers/carriers.component';
import { TrackerComponent} from './tracker/tracker.component';

const routes: Routes = [
  { path: 'sender', component: SenderComponent },
  { path: 'carriern', component: CarriernComponent },
  { path: 'carriers', component: CarriersComponent },
  { path: 'tracker', component: TrackerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
