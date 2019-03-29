import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PlayerComponent } from "./player/player.component";
import { CurrentTrackComponent } from './current-track/current-track.component';
import { ListenComponent } from './listen/listen.component';

const routes: Routes = [
  { path: "admin", component: PlayerComponent },
  { path: "main", component: ListenComponent },
  { path: "current", component: CurrentTrackComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
