import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { QueueComponent } from "./queue/queue.component";
import { HttpClientModule } from "@angular/common/http";
import { SearchComponent } from "./search/search.component";
import { TrackComponent } from "./track/track.component";
import { PlayerComponent } from "./player/player.component";
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { CurrentTrackComponent } from './current-track/current-track.component';



const config: SocketIoConfig = {
  url: "http://localhost:3000"
};

@NgModule({
  declarations: [
    AppComponent,
    QueueComponent,
    SearchComponent,
    TrackComponent,
    PlayerComponent,
    CurrentTrackComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
