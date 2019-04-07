import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../spotify/spotify.service";
import { PlayerService } from './player.service';
import { interval, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatSliderChange } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"]
})
export class PlayerComponent implements OnInit {
  constructor(
    private api: PlayerService,
    private spot: SpotifyService,
    private router: Router,
    private auth: AuthService,
  ) {}

  static player: Spotify.SpotifyPlayer;
  private deviceId!: string;

  public playerState!: Spotify.PlaybackState;
  public isPlaying = false;
  public isStarted = false;
  public shouldStart = false;
  public progress = 0;

  ngOnInit() {
    window.onSpotifyWebPlaybackSDKReady = this.makePlayer.bind(this);
  }

  public makePlayer() {
    // if player has already been created
    if (PlayerComponent.player) {
      return;
    }

    console.log("Creating Player");

    PlayerComponent.player = new Spotify.Player({
      name: "Fizzle Player",
      getOAuthToken: cb => {
        this.spot.getToken().subscribe(token => {
          cb(token);
        });
      }
    });

    const { player } = PlayerComponent;

    player.connect();

    // Error handling
    player.addListener("initialization_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("authentication_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("account_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("playback_error", ({ message }) => {
      console.error(message);
    });

    // Playback status updates
    player.addListener("player_state_changed", state => {
      this.api.sendPlayerState(state).subscribe(() => {});
      this.processState(state);
    });

    // Ready
    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      this.deviceId = device_id;
      if (this.shouldStart) {
        this.start();
      }
    });

    // Not Ready
    player.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id);
    });
  }

  public start() {
    if (!PlayerComponent.player) {
      this.makePlayer();
      this.shouldStart = true;
      return;
    }

    this.isStarted = true;
    this.isPlaying = true;
    this.spot.startQueue(this.deviceId).subscribe(() => {
      console.log("Queue Started");
      // start timer
      interval(300).pipe(
        switchMap(() => from(PlayerComponent.player.getCurrentState()))
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
    PlayerComponent.player.resume();
  }

  public pause() {
    this.isPlaying = false;
    PlayerComponent.player.pause();
  }

  public seek(event: MatSliderChange) {
    const seekTimeMs = (event.value / 100) * this.playerState.duration;
    PlayerComponent.player.seek(seekTimeMs);
  }

  public addTrack() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['search']);
    } else {
      alert("Please Login to add songs");
    }
  }

  public openVibe() {
    this.router.navigate(['vibe']);
  }
}
