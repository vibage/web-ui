import { Component, Input } from "@angular/core";
import { PlayerService } from "src/app/services/player.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-current-track",
  templateUrl: "./current-track.component.html",
  styleUrls: ["./current-track.component.scss"]
})
export class CurrentTrackComponent {
  @Input() playerState: Spotify.PlaybackState;
  @Input() isHost: boolean;
  @Input() hostActions: any;
  @Input() elapse: number;
  @Input() isOn: boolean;

  constructor(private router: Router, public playerService: PlayerService) {}

  private msToReadable(ms: number) {
    const seconds = String(Math.floor(ms / 1000) % 60).padStart(2, "0");
    const minute = String(Math.floor(ms / (60 * 1000))).padStart(2, "0");
    return `${minute}:${seconds}`;
  }

  public openVibe() {
    this.router.navigate(["vibe"]);
  }

  get progress() {
    const duration = this.playerState.track_window.current_track.duration_ms;
    const progress = (this.elapse / duration) * 100;
    if (!this.elapse || !progress) {
      return 0;
    }
    return progress;
  }

  get isStarted() {
    return Boolean(this.playerState);
  }

  get isPlaying() {
    if (this.isStarted) {
      return Boolean(this.playerState && !this.playerState.paused);
    } else {
      return true;
    }
  }

  get trackName() {
    if (this.isStarted) {
      return this.playerState.track_window.current_track.name;
    } else {
      return null;
    }
  }

  get artist() {
    if (this.isStarted) {
      return this.playerState.track_window.current_track.artists[0].name;
    } else {
      return null;
    }
  }

  get imgUrl() {
    if (this.isStarted) {
      return this.playerState.track_window.current_track.album.images[0].url;
    } else {
      return null;
    }
  }

  get durationReadable() {
    if (this.isStarted) {
      return this.msToReadable(
        this.playerState.track_window.current_track.duration_ms
      );
    } else {
      return null;
    }
  }

  get elapseReadable() {
    return this.msToReadable(this.elapse);
  }
}
