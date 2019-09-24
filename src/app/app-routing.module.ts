import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PlayerComponent } from "./listen/player/player.component";
import { ListenComponent } from "./listen/listen.component";
import { HostFindComponent } from "./host-find/host-find.component";
import { VibeSettingsComponent } from "./vibe-settings/vibe-settings.component";
import { AccountComponent } from "./account/account.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";

const routes: Routes = [
  { path: "account", component: AccountComponent },
  { path: "host", component: PlayerComponent },
  { path: "queue/:id", component: ListenComponent },
  { path: "find", component: HostFindComponent },
  { path: "vibe", component: VibeSettingsComponent },
  { path: "", component: HomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
