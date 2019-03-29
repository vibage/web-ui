import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PlayerComponent } from "./player/player.component";
import { QueueComponent } from "./queue/queue.component";
import { CurrentTrackComponent } from './current-track/current-track.component';

const routes: Routes = [
  { path: "admin", component: PlayerComponent },
  { path: "queue", component: QueueComponent },
  { path: "current", component: CurrentTrackComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
