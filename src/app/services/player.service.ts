import { Injectable } from "@angular/core";
import { interval, from, BehaviorSubject } from "rxjs";
import { switchMap, filter } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { QueueService } from "./queue.service";
import { MatSliderChange } from "@angular/material";

@Injectable({
  providedIn: "root"
})
export class PlayerService {
  private player: Spotify.SpotifyPlayer;
  private playerState: Spotify.PlaybackState;

  private gettingNextSong: boolean;
  private lastTrackId: string;

  private deviceId: string;

  public $playerState = new BehaviorSubject<Spotify.PlaybackState>(null);

  constructor(private auth: AuthService, private queueService: QueueService) {}

  public createTimer() {
    // start timer
    interval(300)
      .pipe(
        filter(() => !this.gettingNextSong && Boolean(this.player)),
        switchMap(() => from(this.player.getCurrentState()))
      )
      .subscribe(this.processState.bind(this));
  }

  public start() {
    if (this.player) {
      // player has already been created
      return;
    }

    console.log("Creating Player");
    const player = new Spotify.Player({
      name: "Vibage",
      getOAuthToken: cb => {
        this.auth.getAccessToken().subscribe(token => {
          cb(token);
        });
      }
    });

    player.connect();
    player.addListener("initialization_error", this.logError);
    player.addListener("authentication_error", this.logError);
    player.addListener("account_error", this.logError);
    player.addListener("playback_error", this.logError);
    player.addListener(
      "player_state_changed",
      this.playerStateChanged.bind(this)
    );
    player.addListener("ready", this.playerReady.bind(this));
    player.addListener("not_ready", this.playerNotReady);

    this.player = player;
  }

  private logError({ message }) {
    console.error(message);
  }

  private playerStateChanged(state: Spotify.PlaybackState | null) {
    this.queueService.sendPlayerState(state).subscribe();
    if (!state) {
      return;
    }
    const newId = state.track_window.current_track.id;

    if (this.gettingNextSong && newId !== this.lastTrackId) {
      this.gettingNextSong = false;
    }
    this.processState(state);
  }

  private playerReady({ device_id }) {
    console.log(`Player ready Device ID: ${device_id}`);
    this.deviceId = device_id;

    // start the queue
    this.queueService.startQueue(this.deviceId).subscribe(() => {
      this.createTimer();
    });
  }

  private playerNotReady({ device_id }) {
    console.log(`Device ID has gone offline: ${device_id}`);
  }

  private processState(state: Spotify.PlaybackState) {
    this.playerState = state;
    this.$playerState.next(state);
    if (!state) {
      return;
    }
    const { position, duration } = state;
    if (duration - position < 1100) {
      console.log("Times up");
      this.lastTrackId = state.track_window.current_track.id;
      this.nextTrack();
    }
  }

  public nextTrack() {
    if (this.gettingNextSong) {
      return;
    }
    this.gettingNextSong = true;
    this.queueService.nextTrack().subscribe(() => {
      console.log("Next Song");
    });
  }

  public stop() {
    this.$playerState.next(null);
    this.queueService.stopQueue().subscribe(() => {
      console.log("Stop Queue");
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
}
