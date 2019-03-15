import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
// import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { QueueComponent } from "./queue/queue.component";
import { HttpClientModule } from "@angular/common/http";
import { SearchComponent } from "./search/search.component";
import { TrackComponent } from "./track/track.component";
import { PlayerComponent } from "./player/player.component";
import { MatIconModule } from "@angular/material/icon";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";

const config: SocketIoConfig = {
  url: "http://localhost:3000"
  // options: {
  //   transports: ["websocket", "xhr-polling"]
  // }
};

@NgModule({
  declarations: [
    AppComponent,
    QueueComponent,
    SearchComponent,
    TrackComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    MatProgressBarModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
