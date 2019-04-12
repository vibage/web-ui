import { Component, OnInit, Input } from "@angular/core";
import { ITrack } from "../spotify";
import { TracksService } from "../spotify/tracks.service";
import { QueueService } from "../spotify/queue.service";

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styleUrls: ["./queue.component.scss"]
})
export class QueueComponent implements OnInit {
  @Input() host!: string;

  public tracks: ITrack[] = [];

  public isHost!: boolean;

  constructor(
    private trackService: TracksService,
    private queueService: QueueService
  ) {}

  ngOnInit(): void {
    this.trackService.$tracks.subscribe(tracks => {
      this.queueService.getLikes().subscribe(likes => {
        for (const track of tracks) {
          if (likes.has(track._id)) {
            track.isLiked = true;
          }
        }
        this.tracks = tracks;
      });
    });

    this.isHost = this.host === "true";
  }
}
