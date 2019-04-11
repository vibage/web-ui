import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PlayerComponent } from "./player/player.component";
import { ListenComponent } from './listen/listen.component';
import { HostFindComponent } from './host-find/host-find.component';
import { SearchComponent } from './search/search.component';
import { VibeSettingsComponent } from './vibe-settings/vibe-settings.component';
import { SigninComponent } from './signin/signin.component';
import { HostRegisterComponent } from './signin/host-register/host-register.component';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  { path: "account", component: AccountComponent },
  { path: "host", component: PlayerComponent },
  { path: "login", component: SigninComponent },
  { path: "login/host", component: HostRegisterComponent },
  { path: "queuer", component: ListenComponent },
  { path: "find", component: HostFindComponent },
  { path: "search", component: SearchComponent },
  { path: "vibe", component: VibeSettingsComponent },
  { path: '', redirectTo: '/find', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
