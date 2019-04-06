import { Component, OnInit, Input } from "@angular/core";
import { SpotifyService } from "../spotify/spotify.service";
import { ITrack } from '../spotify';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styleUrls: ["./queue.component.scss"]
})
export class QueueComponent implements OnInit {
  @Input() host!: string;

  public tracks!: any[];

  public isHost!: boolean;

  constructor(private spot: SpotifyService, private fire: AngularFireAuth) {}

  ngOnInit(): void {
    this.fire.authState.pipe(
      take(1)
    ).subscribe(() => {
      this.getTracks();
    })

    this.isHost = this.host === "true";
  }

  public getTracks() {
    this.spot.getQueue().subscribe(data => {
      this.formatTracks(data);
    });

    this.spot.getTracksSocket().subscribe(data => {
      this.formatTracks(data);
    });
  }

  formatTracks(tracks: ITrack[]) {
    this.spot.getMyLikes().subscribe((likeData: any) => {
      const trackIds = new Set();
      for (const like of likeData.payload) {
        trackIds.add(like.trackId);
      }
      for (const track of tracks) {
        if (trackIds.has(track._id)) {
          track.isLiked = true;
        }
      }
      this.tracks = tracks;
    })
  }
}
