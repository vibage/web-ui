import { Component, OnInit, Input } from "@angular/core";
import { SpotifyService } from "../spotify/spotify.service";
import { ITrack } from '../spotify';

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styleUrls: ["./queue.component.scss"]
})
export class QueueComponent implements OnInit {
  @Input() host!: string;

  public tracks!: any[];

  public isHost!: boolean;

  constructor(private spot: SpotifyService) {}

  ngOnInit(): void {
    this.spot.$tracks.subscribe(tracks => {
      this.formatTracks(tracks);
    });

    this.isHost = this.host === "true";
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
