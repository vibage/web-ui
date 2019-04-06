import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PlayerComponent } from "./player/player.component";
import { ListenComponent } from './listen/listen.component';
import { SigninComponent } from './signin/signin.component';
import { HostFindComponent } from './host-find/host-find.component';

const routes: Routes = [
  { path: "host", component: PlayerComponent },
  { path: "queuer", component: ListenComponent },
  { path: "login", component: SigninComponent },
  { path: "find", component: HostFindComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
