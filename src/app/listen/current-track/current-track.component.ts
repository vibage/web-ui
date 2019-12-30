import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";
import { tap, map, combineLatest, take } from "rxjs/operators";
import { QueueService } from "../../services/queue.service";
import { ApiService } from "../../services/api.service";

function msToReadable(ms: number) {
  const seconds = String(Math.floor(ms / 1000) % 60).padStart(2, "0");
  const minute = String(Math.floor(ms / (60 * 1000))).padStart(2, "0");
  return `${minute}:${seconds}`;
}

function getProgress(state: Spotify.PlaybackState, elapse: number) {
  if (!state.track_window.current_track) {
    return 0;
  }
  const duration = state.track_window.current_track.duration_ms;
  const progress = (elapse / duration) * 100;
  if (!elapse || !progress) {
    return 0;
  }
  return progress;
}

function getArtist(state: Spotify.PlaybackState) {
  return state.track_window.current_track.artists[0].name;
}

function getTrackName(state: Spotify.PlaybackState) {
  if (!state.track_window.current_track) { return ""; }
  return state.track_window.current_track.name;
}

function getTimeReadable(state: Spotify.PlaybackState, elapse: number) {
  const duration = msToReadable(state.track_window.current_track.duration_ms);
  return `${msToReadable(elapse)} - ${duration}`;
}

function getImgUrl(state: Spotify.PlaybackState) {
  return state.track_window.current_track.album.images[0].url;
}

function getIsPlaying(state: Spotify.PlaybackState) {
  return (state as any).is_playing;
}

interface VibagePlayerState {
  progress: number;
  trackName: string;
  artist: string;
  timeReadable: string;
  imgUrl: string;
  playing: boolean;
}

@Component({
  selector: "app-current-track",
  templateUrl: "./current-track.component.html",
  styleUrls: ["./current-track.component.scss"]
})
export class CurrentTrackComponent {
  @Input() isHost = false;

  public player$!: Observable<VibagePlayerState>;

  public playing = false;

  private loadingCounter = 0;

  constructor(private router: Router, public api: ApiService, public queueService: QueueService) {
    this.player$ = this.queueService.player$.pipe(
      map((player) => {
        if (!player) { return null; }
        return {
          progress: getProgress(player, player.position),
          trackName: getTrackName(player),
          artist: getArtist(player),
          timeReadable: getTimeReadable(player, player.position),
          imgUrl: getImgUrl(player),
          playing: getIsPlaying(player),
        };
      }),
      tap(player => {
        if (!player) { return; }
        console.log(this.playing, player.playing, this.loadingCounter);
        if (this.playing !== player.playing) {
          this.loadingCounter++;
          if (this.loadingCounter >= 5) {
            this.playing = player.playing;
          }
        } else {
          this.loadingCounter = 0;
        }
      })
    );

    this.player$.pipe(take(1)).subscribe(x => {
      this.playing = x && x.playing;
    });
  }

  public openVibe() {
    this.router.navigate(["vibe"]);
  }

  public nextTrack() {
    this.api.nextTrack().subscribe();
  }

  public play() {
    this.playing = true;
    this.api.play().subscribe();
  }

  public seek() {
    // TODO
  }

  public pause() {
    this.playing = false;
    this.api.pause().subscribe();
  }

  public stop() {
    this.api.stopVibage().subscribe();
  }

  get isStarted() {
    return true;
  }
}
