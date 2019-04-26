import { Component } from "@angular/core";
import "./models/spotify";
import "hammerjs";
// import { PlayerShervice } from "./services/player.service";

// the player is always loaded here. That is not ideal at all

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor() {
    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      console.log("Spotify Loaded");
      // playerService.loadPlayer();
    };
  }
}
