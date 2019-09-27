import { Injectable } from "@angular/core";
import {
  interval,
  from,
  BehaviorSubject,
  combineLatest,
  ReplaySubject,
  Observable
} from "rxjs";
import {
  switchMap,
  filter,
  takeWhile,
  take,
  tap,
  shareReplay,
  map
} from "rxjs/operators";
import { AuthService } from "./auth.service";
import { QueueService } from "./queue.service";
import { MatSliderChange } from "@angular/material";

enum QueueState {
  OFF,
  PLAYING,
  PAUSED,
  WAITING
}

@Injectable({
  providedIn: "root"
})
export class PlayerService {
  private player: Spotify.SpotifyPlayer;

  // I might refactor to this later
  public queueState = QueueState.OFF;

  public queueStarted: boolean; // for telling if the queue is on or not
  private gettingNextSong: boolean;
  private shouldSendPlayerState = false;
  private deviceId: string;

  public playerLoaded = false;
  public isHost = false;

  private playerStateSubject = new ReplaySubject<
    [Spotify.PlaybackState | null, string]
  >();

  public playerState$ = this.playerStateSubject.pipe(
    filter(([state]) => Boolean(state)),
    tap(([state, source]) => {
      if (source === "spotify") {
        console.log("Spot State", state);
      }

      if (this.shouldSendPlayerState || source === "spotify") {
        console.log("Sending player state", state);
        this.shouldSendPlayerState = false;
        this.queueService.sendPlayerState(state).subscribe();
      }

      const { position, duration } = state;
      if (duration - position < 1100) {
        console.log("Times up, Playing next track");
        this.nextTrack();
      }
    }),
    map(([state]) => state),
    shareReplay(1)
  );

  constructor(private auth: AuthService, private queueService: QueueService) {}

  public createTimer() {
    // start timer
    interval(300)
      .pipe(
        takeWhile(() => this.queueStarted), // so the timer will stop once the queue is stopped
        filter(() => !this.gettingNextSong && Boolean(this.player)),
        switchMap(() => from(this.player.getCurrentState()))
      )
      .subscribe(state => this.playerStateSubject.next([state, "timer"]));
  }

  public loadPlayer() {
    // don't run if spotify isn't loaded yet
    if (this.playerLoaded) {
      return;
    }
    console.log("Creating Player");
    const player = new Spotify.Player({
      name: "Vibage",
      getOAuthToken: cb => {
        this.auth.getAccessToken().subscribe(token => {
          console.log(`Access Token: ${token}`);
          cb(token);
        });
      }
    });

    player.connect();
    player.addListener("initialization_error", this.logError);
    player.addListener("authentication_error", this.logError);
    player.addListener("account_error", this.logError);
    player.addListener("playback_error", this.logError);
    player.addListener("player_state_changed", state =>
      this.playerStateSubject.next([state, "spotify"])
    );
    player.addListener("ready", this.playerReady.bind(this));
    player.addListener("not_ready", this.playerNotReady);

    this.player = player;
  }

  public start() {
    console.log("Starting queue");
    this.queueStarted = true;
    // get the user, if they are not the active player then don't start
    this.auth.$user.pipe(take(1)).subscribe(user => {
      if (user._id !== this.queueService.queueId || !this.isHost) {
        console.log("User is not the host");
        return;
      }
      if (this.playerLoaded) {
        this.startQueueHttp();
      } else {
        this.loadPlayer();
      }
    });
  }

  private logError({ message }) {
    console.error(message);
  }

  private playerReady({ device_id }) {
    console.log(`Player ready Device ID: ${device_id}`);
    this.deviceId = device_id;
    this.playerLoaded = true;

    this.auth.$user.pipe(take(1)).subscribe(user => {
      // Resume the queue if the user used to have a playback state
      if (user.player) {
        this.queueService.resume().subscribe(() => {
          console.log("Resuming Queue");
          this.createTimer();
        });
      } else {
        this.startQueueHttp();
      }
    });
  }

  private startQueueHttp() {
    this.queueService.startQueue(this.deviceId).subscribe(() => {
      this.queueStarted = true;
      this.createTimer();
    });
  }

  private playerNotReady({ device_id }) {
    console.log(`Device ID has gone offline: ${device_id}`);
  }

  public nextTrack() {
    if (this.gettingNextSong) {
      return;
    }
    this.gettingNextSong = true;
    this.shouldSendPlayerState = true;
    this.queueService.nextTrack().subscribe(res => {
      if (res === null) {
        console.log("Queue is empty");
      }
      console.log("Next Song");
      // wait 3 seconds before letting you go to the next song
      setTimeout(() => {
        this.gettingNextSong = false;
      }, 3000);
    });
  }

  public stop() {
    this.shouldSendPlayerState = true;
    this.playerStateSubject.next([null, "stop"]);
    this.queueService.stopQueue().subscribe(() => {
      console.log("Stop Queue");
      this.queueStarted = false;
    });
  }

  public play() {
    this.shouldSendPlayerState = true;
    this.player.resume();
  }

  public pause() {
    this.shouldSendPlayerState = true;
    this.player.pause();
  }

  public seek(event: MatSliderChange) {
    this.shouldSendPlayerState = true;
    console.log("Seek");
    this.playerState$.pipe(take(1)).subscribe(playerState => {
      const seekTimeMs = (event.value / 100) * playerState.duration;
      this.player.seek(seekTimeMs);
    });
  }
}
