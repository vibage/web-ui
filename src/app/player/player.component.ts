import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../spotify.service";
import { ITrack } from "../track/track.component";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"]
})
export class PlayerComponent implements OnInit {
  constructor(private spot: SpotifyService) {}

  private player!: Spotify.SpotifyPlayer;
  private songTimer!: any;

  public songProgress!: number;
  public currentTrack!: ITrack;

  waitForSongEnd() {
    this.spot.getPlayer().subscribe(data => {
      console.log(data);
      if (data.status === "204" || !data.is_playing) {
        console.log("No song playing");
        return;
      }

      this.currentTrack = data.item;

      const timeLeft = data.item.duration_ms - data.progress_ms;
      const then = new Date().getTime();
      const endTime = timeLeft + then;
      // start progress bar timer
      clearInterval(this.songTimer);
      this.songTimer = setInterval(() => {
        const now = new Date().getTime();
        const elapse = now - then + data.progress_ms;
        this.songProgress = (elapse / data.item.duration_ms) * 100;

        // check to see if song is over
        if (endTime - now < 1000) {
          console.log("Song Over");
          clearInterval(this.songTimer);
          this.nextSong();
        }
      }, 500);
    });
  }

  ngOnInit() {
    this.waitForSongEnd();
    window.onSpotifyWebPlaybackSDKReady = () => {
      this.player = new Spotify.Player({
        name: "Web Playback SDK Quick Start Player",
        getOAuthToken: cb => {
          this.spot.getToken().subscribe(token => {
            cb(token);
          });
        }
      });

      // Error handling
      this.player.addListener("initialization_error", ({ message }) => {
        console.error(message);
      });
      this.player.addListener("authentication_error", ({ message }) => {
        console.error(message);
      });
      this.player.addListener("account_error", ({ message }) => {
        console.error(message);
      });
      this.player.addListener("playback_error", ({ message }) => {
        console.error(message);
      });

      // Playback status updates
      this.player.addListener("player_state_changed", state => {
        console.log(state);
      });

      // Ready
      this.player.addListener("ready", async ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        // this.deviceId = device_id;
        this.spot.play();
        this.waitForSongEnd();
      });

      // Not Ready
      this.player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });
    };
  }

  public startPlayer() {
    this.player.connect();
  }

  public nextSong() {
    console.log("Next Song");
    this.spot.nextSong().subscribe(data => {
      console.log(data);
      this.waitForSongEnd();
    });
  }
}
