import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../spotify.service";
import { ITrack } from "../track/track.component";
import { filter, switchMap, map, take } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"]
})
export class PlayerComponent implements OnInit {
  constructor(private spot: SpotifyService) {}

  private player!: Spotify.SpotifyPlayer;
  private songInterval: Subscription;

  public songProgress!: number;
  public currentTrack!: ITrack;

  public actionButtonText = "Start";

  waitForSongEnd() {
    const intervalTime = 500;
    let timeLeft!: number;
    console.log("Waiting for song");
    this.songInterval = this.spot.getPlayer().pipe(
      filter(data => {
        if (data.status === "204" || !data.is_playing || !data.item) {
          console.log("No song playing");
          return false;
        }
        return true
      }),
      switchMap(data => {
        this.currentTrack = data.item;
        timeLeft = data.item.duration_ms - data.progress_ms;
        return interval(intervalTime);
      }),
      map(() => {
        timeLeft -= intervalTime;
        this.songProgress =  (1 - (timeLeft / this.currentTrack.duration_ms)) * 100;
        return timeLeft
      }),
      filter(timeLeft => timeLeft < 1000),
      take(1),
    ).subscribe(() => {
      console.log("Song Over");
      this.nextSong();
    });
  }

  ngOnInit() {
    this.waitForSongEnd();
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log("Creating Player");
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
        this.spot.startQueue().subscribe(() => {
          this.setActionButtonText();
          this.waitForSongEnd();
        })
      });

      // Not Ready
      this.player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });
    };
  }

  public playPause() {
    if (!this.spot.isStarted) {
      // if the player is not started, then start it
      this.player.connect();
    } else if (this.spot.isPlaying) {
      this.spot.pause().subscribe(() => {
        this.setActionButtonText();
      })
    } else if (!this.spot.isPlaying) {
      this.spot.play().subscribe(() => {
        this.setActionButtonText();
      });
    }
  }

  public setActionButtonText() {
    if (this.spot.isStarted) {
      this.actionButtonText = this.spot.isPlaying ? "Pause" : "Play"
    } else {
      this.actionButtonText = "Start";
    }
  }

  public startPlayer() {
    this.player.connect();
  }

  public nextSong() {
    console.log("Next Song");
    this.songInterval.unsubscribe();
    this.spot.nextSong().subscribe(data => {
      console.log(data);
      setTimeout(() => this.waitForSongEnd(), 1000);
    });
  }
}
