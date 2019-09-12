import { Injectable } from "@angular/core";
import { interval, from, BehaviorSubject, combineLatest } from "rxjs";
import { switchMap, filter, takeUntil, takeWhile, take } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { QueueService } from "./queue.service";
import { MatSliderChange } from "@angular/material";

@Injectable({
  providedIn: "root"
})
export class PlayerService {
  private player: Spotify.SpotifyPlayer;
  private playerState: Spotify.PlaybackState;

  public queueStarted: boolean; // for telling if the queue is on or not

  private gettingNextSong: boolean;

  private deviceId: string;

  public $playerState = new BehaviorSubject<Spotify.PlaybackState>(null);
  public playerLoaded = false;

  public isHost = false;

  constructor(private auth: AuthService, private queueService: QueueService) {}

  // this is the state of the component
  public queueStateSubject = new BehaviorSubject<boolean>(false);

  public ngOnInit(): void {
    combineLatest(this.auth.$user, this.queueStateSubject).subscribe(
      ([user, queueOn]) => {
        if (!queueOn) {
          return;
        }
      }
    );
  }

  public createTimer() {
    // start timer
    interval(300)
      .pipe(
        takeWhile(() => this.queueStarted), // so the timer will stop once the queue is stopped
        filter(() => !this.gettingNextSong && Boolean(this.player)),
        switchMap(() => from(this.player.getCurrentState()))
      )
      .subscribe(this.processState.bind(this));
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

  private playerStateChanged(state: Spotify.PlaybackState | null) {
    this.queueService.sendPlayerState(state).subscribe();
    if (!state) {
      return;
    }
    this.processState(state);
  }

  private playerReady({ device_id }) {
    console.log(`Player ready Device ID: ${device_id}`);
    this.deviceId = device_id;
    this.playerLoaded = true;

    this.auth.$user.pipe(take(1)).subscribe(user => {
      if (user.player) {
        this.queueService.resume().subscribe(() => {
          console.log("Queue Resumed");
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

  private processState(state: Spotify.PlaybackState) {
    this.playerState = state;
    this.$playerState.next(state);
    if (!state) {
      return;
    }
    const { position, duration } = state;
    if (duration - position < 1100) {
      console.log("Times up");
      this.nextTrack();
    }
  }

  public nextTrack() {
    if (this.gettingNextSong) {
      return;
    }
    this.gettingNextSong = true;
    this.queueService.nextTrack().subscribe(res => {
      if (res === null) {
        // queue was empty
        console.log("Queue was empty");
        this.playerState = null;
      }
      console.log("Next Song");
      // wait 3 seconds before letting you go to the next song
      setTimeout(() => {
        this.gettingNextSong = false;
      }, 3000);
    });
  }

  public stop() {
    this.queueStarted = false;
    this.$playerState.next(null);
    this.playerState = null;
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
