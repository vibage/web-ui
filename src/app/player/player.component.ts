import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../spotify/spotify.service";
import { PlayerService } from './player.service';
import { interval, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import "./spotifyPlayer";
import { MatSliderChange } from '@angular/material';


@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"]
})
export class PlayerComponent implements OnInit {
  constructor(private api: PlayerService, private spot: SpotifyService) {}

  private player!: Spotify.SpotifyPlayer;
  private deviceId!: string;

  public playerState!: Spotify.PlaybackState;
  public isPlaying = false;
  public isStarted = false;
  public progress = 0;

  ngOnInit() {
    // this.waitForSongEnd();
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log("Creating Player");

      this.player = new Spotify.Player({
        name: "Fizzle Player",
        getOAuthToken: cb => {
          this.spot.getToken().subscribe(token => {
            cb(token);
          });
        }
      });

      this.player.connect();

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
        this.api.sendPlayerState(state).subscribe(() => {});
        this.processState(state);
      });

      // Ready
      this.player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        this.deviceId = device_id;
      });

      // Not Ready
      this.player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });
    };
  }

  public start() {
    this.isStarted = true;
    this.isPlaying = true;
    this.spot.startQueue(this.deviceId).subscribe(() => {
      console.log("Queue Started");
      // start timer
      interval(300).pipe(
        switchMap(() => from(this.player.getCurrentState()))
      ).subscribe(state => {
        this.processState(state)
      })
    });
  }

  public processState(state: Spotify.PlaybackState) {
    if (!state) return;
    this.playerState = state;
    const { position , duration } = state;
    this.progress = (position / duration) * 100;

    if (duration - position < 1100) {
      this.nextTrack();
    }
  }

  public nextTrack() {
    this.api.nextTrack().subscribe(() => {
      console.log("Next Song");
    })
  }

  public play() {
    this.isPlaying = true;
    this.player.resume();
  }

  public pause() {
    this.isPlaying = false;
    this.player.pause();
  }

  public seek(event: MatSliderChange) {
    const seekTimeMs = (event.value / 100) * this.playerState.duration;
    this.player.seek(seekTimeMs);
  }
}
