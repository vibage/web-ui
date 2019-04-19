import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { interval, from } from "rxjs";
import { switchMap } from "rxjs/operators";
import { MatSliderChange } from "@angular/material";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { QueueService } from "../../services/queue.service";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"]
})
export class PlayerComponent implements OnInit {
  private player: Spotify.SpotifyPlayer;
  private deviceId!: string;
  private shouldStart = false;
  private gettingNextSong = false;

  public idLoaded = false;
  public playerState!: Spotify.PlaybackState;
  public elapse = 0;
  public hostActions!: any;

  constructor(
    private spot: SpotifyService,
    private router: Router,
    private auth: AuthService,
    private queueService: QueueService
  ) {
    this.auth.getUser().subscribe(user => {
      this.queueService.setQueueId(user._id);
      this.idLoaded = true;
    });
    this.hostActions = {
      start: this.start.bind(this),
      next: this.nextTrack.bind(this),
      play: this.play.bind(this),
      pause: this.pause.bind(this),
      seek: this.seek.bind(this),
      vibe: this.openVibe.bind(this)
    };

    (<any>window).onSpotifyWebPlaybackSDKReady = this.makePlayer.bind(this);
  }

  ngOnInit() {
    if (this.player) {
      this.setUpStart();
    }
  }

  public makePlayer() {
    // if player has already been created
    if (this.player) {
      return;
    }

    console.log("Creating Player");

    this.player = new Spotify.Player({
      name: "Fizzle Player",
      getOAuthToken: cb => {
        this.spot.getAccessToken().subscribe(token => {
          cb(token);
        });
      }
    });

    const { player } = this;

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
      this.queueService.sendPlayerState(state).subscribe();
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
    if (!this.player) {
      this.makePlayer();
      this.shouldStart = true;
      return;
    }

    console.log("Starting Queue");

    this.queueService.startQueue(this.deviceId).subscribe(() => {
      this.setUpStart();
    });
  }

  public setUpStart() {
    // start timer
    interval(300)
      .pipe(switchMap(() => from(this.player.getCurrentState())))
      .subscribe(state => {
        this.processState(state);
      });
  }

  public processState(state: Spotify.PlaybackState) {
    this.playerState = state;
    if (!state) {
      return;
    }
    const { position, duration } = state;
    this.elapse = position;
    if (duration - position < 1100) {
      this.nextTrack();
    }
  }

  public nextTrack() {
    if (this.gettingNextSong) {
      return;
    }
    this.gettingNextSong = true;
    this.queueService.nextTrack().subscribe(() => {
      this.gettingNextSong = false;
      console.log("Next Song");
    });
  }

  public play() {
    this.player.resume();
  }

  public pause() {
    this.player.pause();
  }

  public seek(event: MatSliderChange) {
    const seekTimeMs = (event.value / 100) * this.playerState.duration;
    this.player.seek(seekTimeMs);
  }

  public openVibe() {
    this.router.navigate(["vibe"]);
  }
}
