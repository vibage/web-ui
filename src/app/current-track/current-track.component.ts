import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify/spotify.service';

@Component({
  selector: 'app-current-track',
  templateUrl: './current-track.component.html',
  styleUrls: ['./current-track.component.scss']
})
export class CurrentTrackComponent implements OnInit {
  constructor(private spot: SpotifyService) { }

  public progress!: number;
  public title!: string;

  public trackName: string;
  public trackArtist: string;
  public imgUrl: string;

  public isOn!: boolean;

  private timerInterval!: any;

  ngOnInit() {
    this.spot.$player.subscribe((player: Spotify.PlaybackState) => {
      console.log(player);
      clearInterval(this.timerInterval);
      this.isOn = Boolean(player);
      if (!player) return;

      let { track_window, position, duration, paused } = player;
      const { name, artists, album } = track_window.current_track

      this.title = `${name} - ${artists[0].name}`;

      this.trackName = name;
      this.trackArtist = artists[0].name;
      this.imgUrl = album.images[0].url;

      this.progress = (position / duration) * 100;

      if (!paused) {
        const intervalTime = 300;
        this.timerInterval = setInterval(() => {
          position += intervalTime;
          this.progress = (position / duration) * 100
        }, intervalTime)
      }

    });
  }
}
