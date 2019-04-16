// Angular modules
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from "../environments/environment";

// Components
import { AppComponent } from "./app.component";
import { CurrentTrackComponent } from "./current-track/current-track.component";
import { ListenComponent } from "./listen/listen.component";
import { SearchComponent } from "./listen/search/search.component";
import { PlayerComponent } from "./player/player.component";
import { QueueComponent } from "./queue/queue.component";

// Shared
import { TrackComponent } from "./shared/track/track.component";

// Material
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatSliderModule } from "@angular/material/slider";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatListModule } from "@angular/material/list";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material";

// Socket
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";

// Firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { SigninComponent } from "./signin/signin.component";
import { HostFindComponent } from "./host-find/host-find.component";
import { HeaderComponent } from "./header/header.component";
import { VibeSettingsComponent } from "./vibe-settings/vibe-settings.component";
import { AccountComponent } from "./account/account.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";

const config: SocketIoConfig = {
  url: environment.apiUrl
};

@NgModule({
  declarations: [
    AppComponent,
    QueueComponent,
    SearchComponent,
    TrackComponent,
    PlayerComponent,
    CurrentTrackComponent,
    ListenComponent,
    SigninComponent,
    HostFindComponent,
    HeaderComponent,
    VibeSettingsComponent,
    AccountComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    MatProgressBarModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
    MatCardModule,
    MatButtonModule,
    MatSliderModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase, "fizzle"),
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    const code = new URL(location.href).searchParams.get("code");
    if (code) {
      location.assign(`${location.origin}/#/account?code=${code}`);
    }
  }
}
