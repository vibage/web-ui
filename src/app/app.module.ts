// Angular modules
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from '../environments/environment';

// Components
import { AppComponent } from "./app.component";
import { CurrentTrackComponent } from './current-track/current-track.component';
import { ListenComponent } from './listen/listen.component';
import { SearchComponent } from "./search/search.component";
import { TrackComponent } from "./track/track.component";
import { PlayerComponent } from "./player/player.component";
import { QueueComponent } from "./queue/queue.component";

// Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";

// Socket
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { SigninComponent } from './signin/signin.component';
import { HostFindComponent } from './host-find/host-find.component';

const config: SocketIoConfig = {
  url: environment.apiUrl,
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
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'fizzle'),
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
