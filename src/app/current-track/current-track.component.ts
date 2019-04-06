import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify/spotify.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-current-track',
  templateUrl: './current-track.component.html',
  styleUrls: ['./current-track.component.scss']
})
export class CurrentTrackComponent implements OnInit {
  constructor(private spot: SpotifyService, private fire: AngularFireAuth) { }

  public progress!: number;
  public title!: string;
  public isOn!: boolean;

  private timerInterval!: any;

  ngOnInit() {
    this.spot.getPlayerSocket().subscribe((player: Spotify.PlaybackState) => {
      console.log(player);
      clearInterval(this.timerInterval);
      this.isOn = Boolean(player);
      if (!player) return;

      let { track_window, position, duration, paused } = player;
      const { name, artists } = track_window.current_track

      this.title = `${name} - ${artists[0].name}`

      this.progress = (position / duration) * 100;

      if (!paused) {
        const intervalTime = 300;
        this.timerInterval = setInterval(() => {
          position += intervalTime;
          this.progress = (position / duration) * 100
        }, intervalTime)
      }

    });

    this.fire.authState.pipe(
      take(1),
    ).subscribe(() => {
      this.spot.getPlayer();
    })

  }
}
