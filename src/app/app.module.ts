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
import { CurrentTrackComponent } from "./listen/current-track/current-track.component";
import { ListenComponent } from "./listen/listen.component";
import { SearchComponent } from "./listen/search/search.component";
import { PlayerComponent } from "./listen/player/player.component";
import { QueueComponent } from "./listen/queue/queue.component";

// Shared
import { TrackComponent } from "./listen/track/track.component";

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
import { MatDialogModule } from "@angular/material";

// Other Libraries
import { ToastrModule } from "ngx-toastr";

// Firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { SigninComponent } from "./account/signin/signin.component";
import { HostFindComponent } from "./host-find/host-find.component";
import { HeaderComponent } from "./header/header.component";
import { VibeSettingsComponent } from "./vibe-settings/vibe-settings.component";
import { AccountComponent } from "./account/account.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { TrackInfoModalComponent } from "./listen/track/track-info-modal/track-info-modal.component";
import { TrackPreviewModalComponent } from "./listen/search/track-preview-modal/track-preview-modal.component";

const toastConfig = {
  timeOut: 10000,
  positionClass: "toast-bottom-right",
  preventDuplicates: true
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
    HostFindComponent,
    HeaderComponent,
    VibeSettingsComponent,
    AccountComponent,
    HomePageComponent,
    SigninComponent,
    TrackInfoModalComponent,
    TrackPreviewModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    MatProgressBarModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatSliderModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ToastrModule.forRoot(toastConfig),
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase, "fizzle"),
    AngularFireAuthModule
  ],
  entryComponents: [
    SigninComponent,
    TrackInfoModalComponent,
    TrackPreviewModalComponent
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
