import { Component } from "@angular/core";
import "./models/spotify";
import "hammerjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor() {
    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      console.log("Spotify Loaded");
    };
  }
}
