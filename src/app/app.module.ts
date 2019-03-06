import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
// import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { QueueComponent } from "./queue/queue.component";
import { HttpClientModule } from "@angular/common/http";
import { SearchComponent } from './search/search.component';

// const config: SocketIoConfig = { url: 'http://localhost:8988', options: {} };

@NgModule({
  declarations: [AppComponent, QueueComponent, SearchComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
